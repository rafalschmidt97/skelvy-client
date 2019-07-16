import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  inBackground: boolean;
  private generatedId = 0;

  constructor(
    private readonly translateService: TranslateService,
    private readonly localNotifications: LocalNotifications,
    platform: Platform,
  ) {
    platform.pause.subscribe(() => {
      this.inBackground = true;
    });

    platform.resume.subscribe(() => {
      this.inBackground = false;
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
}
