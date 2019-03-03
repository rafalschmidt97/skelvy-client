import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { _ } from '../i18n/translate';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  static readonly TOAST_POSITION = 'top';
  static readonly TOAST_DURATION = 4000;

  constructor(
    private readonly translateService: TranslateService,
    private readonly toastController: ToastController,
  ) {}

  async create(
    message: string,
    color: string = 'primary',
    duration: number = ToastService.TOAST_DURATION,
    showCloseButton: boolean = true,
    translateMessage: boolean = true,
    position: any = ToastService.TOAST_POSITION,
  ) {
    let toast;

    if (translateMessage) {
      message = await this.translateService.get(message).toPromise();
    }

    if (showCloseButton) {
      const translatedDone = await this.translateService
        .get(_('Done'))
        .toPromise();

      toast = await this.toastController.create({
        message: message,
        showCloseButton: true,
        color: color,
        duration: duration,
        closeButtonText: translatedDone,
        position: position,
      });
    } else {
      toast = await this.toastController.create({
        message: message,
        showCloseButton: false,
        color: color,
        duration: duration,
        position: position,
      });
    }

    toast.present();
  }

  async createError(
    message: string,
    duration?: number,
    showCloseButton?: boolean,
    translateMessage?: boolean,
    position?: string,
  ) {
    await this.create(
      message,
      'danger',
      duration,
      showCloseButton,
      translateMessage,
      position,
    );
  }

  async createInformation(
    message: string,
    duration?: number,
    showCloseButton?: boolean,
    translateMessage?: boolean,
    position?: string,
  ) {
    await this.create(
      message,
      'light',
      duration,
      showCloseButton,
      translateMessage,
      position,
    );
  }
}
