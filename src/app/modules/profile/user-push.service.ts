import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { ToastService } from '../../core/toast/toast.service';
import { Push } from '@ionic-native/push/ngx';
import { UserService } from './user.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { UserStoreService } from './user-store.service';

@Injectable({
  providedIn: 'root',
})
export class UserPushService {
  constructor(
    private readonly push: Push,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly storage: Storage,
    private readonly platform: Platform,
    private readonly userStore: UserStoreService,
  ) {}

  initialize() {
    this.storage.get('push').then((exists: boolean) => {
      if (!exists) {
        this.push.createChannel({
          id: 'push',
          description: 'Push Channel',
          importance: 3,
        });

        const push$ = this.getPushListener();

        push$.on('registration').subscribe(async () => {
          await this.storage.set('push', true);
          await this.storage.set('pushTopicAll', true);
          await this.storage.set('pushTopicPlatform', true);
        });

        push$.on('error').subscribe(x => {
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
    this.getInitializedPushListener().then(listener => {
      listener.subscribe(topic).then(
        () => {
          this.storage.set(storageKey, true);
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while adding a push notification topic'),
          );
        },
      );
    });
  }

  removeTopic(topic: string, storageKey: string) {
    this.getInitializedPushListener().then(listener => {
      listener.unsubscribe(topic).then(
        () => {
          this.storage.set(storageKey, false);
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while removing a push notification topic'),
          );
        },
      );
    });
  }

  private getPushListener() {
    return this.push.init({
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
  }

  private async getInitializedPushListener() {
    const all = await this.storage.get('pushTopicAll');
    const platform = await this.storage.get('pushTopicPlatform');
    const user = await this.storage.get('pushTopicUser');
    const topics: string[] = [];

    if (all) {
      topics.push('all');
    }

    if (platform) {
      const platformName = this.platform.is('android') ? 'android' : 'ios';
      topics.push(platformName);
    }

    if (user) {
      topics.push('user-' + this.getUserId());
    }

    return this.push.init({
      android: {
        topics: topics,
      },
      ios: {
        alert: true,
        badge: true,
        sound: true,
        topics: topics,
      },
    });
  }

  private getUserId(): number {
    return this.userStore.data.id;
  }
}
