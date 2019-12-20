import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { ToastService } from '../../core/toast/toast.service';
import { Push, PushObject } from '@ionic-native/push/ngx';
import { UserService } from './user.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { storageKeys } from '../../core/storage/storage';
import { Store } from '@ngxs/store';
import {
  ILocalNotification,
  LocalNotifications,
} from '@ionic-native/local-notifications/ngx';
import { isNil } from 'lodash';
import {
  PushNotificationMessage,
  SocketNotificationMessage,
} from '../../core/background/background';
import { GroupsService } from '../groups/groups.service';

@Injectable({
  providedIn: 'root',
})
export class UserPushService {
  private push$: PushObject;

  constructor(
    private readonly push: Push,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly storage: Storage,
    private readonly platform: Platform,
    private readonly routerNavigation: NavController,
    private readonly store: Store,
    private readonly localNotifications: LocalNotifications,
    private readonly groupsService: GroupsService,
  ) {}

  async initialize() {
    const push = await this.storage.get(storageKeys.push);
    if (!push) {
      await this.push.hasPermission();

      this.push$ = this.push.init({
        android: {
          topics: ['all', 'android'],
        },
        ios: {
          alert: true,
          badge: true,
          sound: true,
          topics: ['all', 'ios'],
        },
      });

      this.push$.on('registration').subscribe(async () => {
        await this.storage.set(storageKeys.push, true);
        await this.storage.set(storageKeys.pushTopicAll, true);
        await this.storage.set(storageKeys.pushTopicPlatform, true);
      });

      this.push$.on('error').subscribe(() => {
        this.toastService.createError(
          _('A problem occurred while registering the device'),
        );
      });
    }
  }

  async connect() {
    if (!this.push$) {
      this.push$ = this.push.init({});
    }

    this.push$
      .on('notification')
      .subscribe((notification: PushNotificationMessage) => {
        if (!notification.additionalData.foreground) {
          const { redirect_to, action, data } = notification.additionalData;
          const dataJson = JSON.parse(data);
          if (redirect_to === 'meetings') {
            this.routerNavigation.navigateRoot(['/app/tabs/meetings']);
          } else if (redirect_to === 'groups') {
            if (data.groupId) {
              this.routerNavigation
                .navigateForward(['/app/groups', data.groupId, 'chat'])
                .then(async () => {
                  if (action === 'UserSentMessage') {
                    await this.groupsService.readMessagesFromState(
                      dataJson[0].group_id,
                    );
                  }
                });
            } else {
              this.routerNavigation.navigateForward(['/app/tabs/groups']);
            }
          }
        }
      });

    this.localNotifications
      .on('click')
      .subscribe((notification: SocketNotificationMessage) => {
        if (notification.data) {
          const { redirectTo, action, data } = notification.data;
          if (redirectTo === 'meetings') {
            this.routerNavigation.navigateRoot(['/app/tabs/meetings']);
          } else if (redirectTo === 'groups') {
            if (data.groupId) {
              this.routerNavigation
                .navigateForward(['/app/groups', data.groupId, 'chat'])
                .then(async () => {
                  if (action === 'UserSentMessage') {
                    await this.groupsService.readMessagesFromState(
                      data[0].groupId,
                    );
                  }
                });
            } else {
              this.routerNavigation.navigateForward(['/app/tabs/groups']);
            }
          }
        }
      });

    const localDefaults: ILocalNotification = {
      sound: 'default',
      smallIcon: 'res://notification_icon',
      foreground: false,
      data: { foreground: false },
    };

    await this.localNotifications.setDefaults(localDefaults);

    this.storage
      .get(storageKeys.pushTopicUser)
      .then(async (pushTopicUser: boolean) => {
        if (isNil(pushTopicUser)) {
          const userId = this.getUserId();

          if (userId) {
            await this.addTopic(
              'user-' + this.getUserId(),
              storageKeys.pushTopicUser,
            );
          }
        }
      });

    this.clear().then(() => {});

    this.platform.resume.subscribe(async () => {
      await this.clear();
    });
  }

  async disconnect() {
    if (!this.push$) {
      this.push$ = this.push.init({});
    }

    const userId = this.getUserId();

    if (userId) {
      await this.removeTopic(
        'user-' + this.getUserId(),
        storageKeys.pushTopicUser,
      );
    }
  }

  addTopic(topic: string, storageKey: string): Promise<any> {
    if (!this.push$) {
      this.push$ = this.push.init({});
    }

    return this.push$.subscribe(topic).then(
      async () => {
        await this.storage.set(storageKey, true);
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while adding push notification topic'),
        );
      },
    );
  }

  removeTopic(topic: string, storageKey: string): Promise<any> {
    if (!this.push$) {
      this.push$ = this.push.init({});
    }

    return this.push$.unsubscribe(topic).then(
      async () => {
        await this.storage.set(storageKey, false);
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while removing push notification topic'),
        );
      },
    );
  }

  async clear() {
    await this.push$.setApplicationIconBadgeNumber(1);
    await this.push$.setApplicationIconBadgeNumber(0);
    await this.push$.clearAllNotifications();
  }

  private getUserId(): number | null {
    const user = this.store.selectSnapshot(state => state.user.user);
    return user ? user.id : null;
  }
}
