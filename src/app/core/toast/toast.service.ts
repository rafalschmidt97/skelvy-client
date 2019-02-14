import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { _ } from '../i18n/translate';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  static readonly TOAST_POSITION = 'bottom';
  static readonly TOAST_DURATION = 4000;

  constructor(
    private readonly translateService: TranslateService,
    private readonly toastController: ToastController,
  ) {}

  async create(
    message: string,
    color: string = 'primary',
    duration: number = ToastService.TOAST_DURATION,
    position: any = ToastService.TOAST_POSITION,
  ) {
    const translatedMessage = await this.translateService
      .get(message)
      .toPromise();
    const translatedDone = await this.translateService
      .get(_('Done'))
      .toPromise();

    const toast = await this.toastController.create({
      message: translatedMessage,
      showCloseButton: true,
      color: color,
      duration: duration,
      closeButtonText: translatedDone,
      position: position,
    });
    toast.present();
  }

  async createError(message: string, duration?: number, position?: string) {
    await this.create(message, 'danger', duration, position);
  }

  async createInformation(
    message: string,
    duration?: number,
    position?: string,
  ) {
    await this.create(message, 'light', duration, position);
  }
}
