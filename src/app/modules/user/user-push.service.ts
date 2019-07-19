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
  ) {
    this.push$ = this.push.init({});
  }

  initialize() {
    this.storage.get(storageKeys.push).then(async (exists: boolean) => {
      if (!exists) {
        await this.push.createChannel({
          id: 'push',
          description: 'Push Channel',
          importance: 3,
        });

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
    });
  }

  connect() {
    this.push$.on('notification').subscribe(notification => {
      if (!notification.additionalData.foreground) {
        const { redirect_to } = notification.additionalData;
        if (redirect_to === 'meeting') {
          this.routerNavigation.navigateRoot(['/app/tabs/meeting']);
        } else if (redirect_to === 'chat') {
          this.routerNavigation.navigateForward(['/app/chat']);
        }
      }
    });

    this.localNotifications.on('click').subscribe(notification => {
      if (notification.data && !notification.data.foreground) {
        const { redirect_to } = notification.data;
        if (redirect_to === 'meeting') {
          this.routerNavigation.navigateRoot(['/app/tabs/meeting']);
        } else if (redirect_to === 'chat') {
          this.routerNavigation.navigateForward(['/app/chat']);
        }
      }
    });

    const localDefaults: ILocalNotification = {
      sound: 'default',
      smallIcon: 'res://notification_icon',
      foreground: false,
      data: { foreground: false },
    };

    this.localNotifications.setDefaults(localDefaults);

    this.storage.get(storageKeys.pushTopicUser).then((exists: boolean) => {
      if (!exists) {
        this.addTopic('user-' + this.getUserId(), storageKeys.pushTopicUser);
      }
    });

    this.clear().then(() => {});

    this.platform.resume.subscribe(async () => {
      await this.clear();
    });
  }

  disconnect() {
    this.removeTopic('user-' + this.getUserId(), storageKeys.pushTopicUser);
  }

  addTopic(topic: string, storageKey: string) {
    this.push$.subscribe(topic).then(
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

  removeTopic(topic: string, storageKey: string) {
    this.push$.unsubscribe(topic).then(
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

  private getUserId(): number {
    return this.store.selectSnapshot(state => state.user.user.id);
  }
}
