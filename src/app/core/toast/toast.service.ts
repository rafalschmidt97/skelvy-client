import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import {
  SocketNotificationMessage,
  SocketNotificationType,
} from '../background/background';
import { BackgroundService } from '../background/background.service';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  isBusy: boolean;
  private readonly position = 'top';
  private readonly duration = 5000;

  constructor(
    private readonly translateService: TranslateService,
    private readonly toastController: ToastController,
    private readonly backgroundService: BackgroundService,
    private readonly vibration: Vibration,
  ) {}

  async create(
    message: string,
    translateMessage: boolean,
    title: string,
    translateTitle: boolean,
    color: string,
    clickHandler: () => void,
  ) {
    if (!this.isBusy && !this.backgroundService.inBackground) {
      let toast;

      if (translateMessage) {
        message = await this.translateService.get(message).toPromise();
      }

      if (translateTitle) {
        title = await this.translateService.get(title).toPromise();
      }

      message =
        message.length > 70 ? message.substring(0, 70) + '...' : message;

      if (clickHandler) {
        toast = await this.toastController.create({
          message: title ? `${title}: ${message}` : message,
          color: color,
          duration: this.duration,
          position: this.position,
          buttons: [
            {
              side: 'end',
              icon: 'arrow-round-forward',
              handler: () => {
                clickHandler();
              },
            },
          ],
        });
      } else {
        toast = await this.toastController.create({
          message: message,
          color: color,
          duration: this.duration,
          position: this.position,
          buttons: [
            {
              side: 'end',
              icon: 'close',
              role: 'cancel',
            },
          ],
        });
      }

      this.vibration.vibrate(300);
      await toast.present();

      this.isBusy = true;
      setTimeout(() => {
        this.isBusy = false;
      }, this.duration);
    }
  }

  async createError(
    message: string,
    translateMessage: boolean = true,
    title: string = null,
    translateTitle: boolean = true,
    clickHandler: () => void = null,
  ) {
    await this.create(
      message,
      translateMessage,
      title,
      translateTitle,
      'danger',
      clickHandler,
    );
  }

  async createWarning(
    message: string,
    translateMessage: boolean = true,
    title: string = null,
    translateTitle: boolean = true,
    clickHandler: () => void = null,
  ) {
    await this.create(
      message,
      translateMessage,
      title,
      translateTitle,
      'warning',
      clickHandler,
    );
  }

  async createInformation(
    message: string,
    translateMessage: boolean = true,
    title: string = null,
    translateTitle: boolean = true,
    clickHandler: () => void = null,
  ) {
    await this.create(
      message,
      translateMessage,
      title,
      translateTitle,
      'light',
      clickHandler,
    );
  }
  async createInformationFromNotification(
    notification: SocketNotificationMessage,
    clickHandler: () => void = null,
  ) {
    if (notification.type === SocketNotificationType.REGULAR) {
      await this.create(
        notification.notification.bodyLocKey || notification.notification.body,
        !!notification.notification.bodyLocKey,
        notification.notification.titleLocKey ||
          notification.notification.title,
        !!notification.notification.titleLocKey,
        'light',
        clickHandler,
      );
    }
  }
}
