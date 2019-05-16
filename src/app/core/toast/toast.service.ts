import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  static readonly TOAST_POSITION = 'top';
  static readonly TOAST_DURATION = 5000;

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
      toast = await this.toastController.create({
        message: message,
        color: color,
        duration: duration,
        buttons: [
          {
            side: 'end',
            icon: 'close',
            role: 'cancel',
          },
        ],
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

  async createWarning(
    message: string,
    duration?: number,
    showCloseButton?: boolean,
    translateMessage?: boolean,
    position?: string,
  ) {
    await this.create(
      message,
      'warning',
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
