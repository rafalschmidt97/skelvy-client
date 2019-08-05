import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { storageKeys } from '../storage/storage';
import { SocketNotificationMessage } from './background';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  inBackground: boolean;
  allowPush: boolean;
  private generatedId = 0;

  constructor(
    private readonly translateService: TranslateService,
    private readonly localNotifications: LocalNotifications,
    platform: Platform,
    storage: Storage,
  ) {
    platform.pause.subscribe(() => {
      this.inBackground = true;
    });

    platform.resume.subscribe(() => {
      this.inBackground = false;
    });

    storage.get(storageKeys.pushTopicUser).then((push: boolean) => {
      this.allowPush = push;
    });
  }

  create(
    title: string,
    message: string,
    data?: any,
    translateTitle: boolean = true,
    translateMessage: boolean = true,
  ) {
    if (translateTitle) {
      title = this.translateService.instant(title);
    }

    if (translateMessage) {
      message = this.translateService.instant(message);
    }

    if (data) {
      this.localNotifications.schedule({
        id: this.generatedId,
        title,
        text: message,
        data,
      });
    } else {
      this.localNotifications.schedule({
        id: this.generatedId,
        title,
        text: message,
      });
    }

    this.generatedId++;
  }

  createFromNotification(message: SocketNotificationMessage) {
    const translateTitle = message.notification.titleLocKey;
    const translateBody = message.notification.bodyLocKey;
    this.create(
      translateTitle
        ? message.notification.titleLocKey
        : message.notification.titleLocKey,
      translateBody
        ? message.notification.bodyLocKey
        : message.notification.body,
      message.data,
      !!translateTitle,
      !!translateBody,
    );
  }
}
