import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { ToastService } from '../../core/toast/toast.service';
import { Push, PushObject } from '@ionic-native/push/ngx';
import { UserService } from './user.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { UserStoreService } from './user-store.service';

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
    private readonly userStore: UserStoreService,
  ) {
    this.push$ = this.push.init({});
  }

  initialize() {
    this.storage.get('push').then((exists: boolean) => {
      if (!exists) {
        this.push.createChannel({
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
          await this.storage.set('push', true);
          await this.storage.set('pushTopicAll', true);
          await this.storage.set('pushTopicPlatform', true);
        });

        this.push$.on('error').subscribe(x => {
          this.toastService.createError(
            _('A problem occurred while registering the device'),
          );
        });
      }
    });
  }

  connect() {
    this.storage.get('pushTopicUser').then((exists: boolean) => {
      if (exists == null) {
        this.addTopic('user-' + this.getUserId(), 'pushTopicUser');
      }
    });
  }

  disconnect() {
    this.removeTopic('user-' + this.getUserId(), 'pushTopicUser');
  }

  addTopic(topic: string, storageKey: string) {
    this.push$.subscribe(topic).then(
      () => {
        this.storage.set(storageKey, true);
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while adding a push notification topic'),
        );
      },
    );
  }

  removeTopic(topic: string, storageKey: string) {
    this.push$.unsubscribe(topic).then(
      () => {
        this.storage.set(storageKey, false);
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while removing a push notification topic'),
        );
      },
    );
  }

  private getUserId(): number {
    return this.userStore.data.id;
  }
}
