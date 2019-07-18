import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { UserSocketService } from '../../user/user-socket.service';
import { UserPushService } from '../../user/user-push.service';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../core/loading/loading.service';
import { AlertModalComponent } from '../../../shared/components/alert/alert-modal/alert-modal.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  version: string;
  loadingLogout = false;

  constructor(
    private readonly routerNavigation: NavController,
    private readonly emailComposer: EmailComposer,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly userSocket: UserSocketService,
    private readonly userPush: UserPushService,
    private readonly device: Device,
    private readonly browser: InAppBrowser,
    private readonly rate: AppRate,
    private readonly share: SocialSharing,
    private readonly translateService: TranslateService,
    private readonly loadingService: LoadingService,
    private readonly modalController: ModalController,
  ) {
    this.version = environment.version;
  }

  async logout() {
    if (!this.loadingLogout) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant(
            'Are you sure you want to log out from your account?',
          ),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        this.confirmLogout();
      }
    }
  }

  confirmLogout() {
    this.loadingLogout = true;
    this.loadingService.lock();
    this.userSocket.disconnect();
    this.userPush.disconnect();

    this.authService.logout().subscribe(
      () => {
        this.loadingLogout = false;
        this.loadingService.unlock();
        this.routerNavigation.navigateBack(['/home']);
        setTimeout(() => {
          this.toastService.createInformation(_('Successfully logged out'));
        }, 1000);
      },
      () => {
        this.authService.logoutWithoutRequest().then(() => {
          this.loadingLogout = false;
          this.loadingService.unlock();
          this.routerNavigation.navigateBack(['/home']);
          setTimeout(() => {
            this.toastService.createError(
              _('A problem occurred while logging out'),
            );
          }, 1000);
        });
      },
    );
  }

  async sendReport() {
    const subject = await this.translateService
      .get(_('Report a bug'))
      .toPromise();

    this.emailComposer
      .open({
        to: 'contact.skelvy@gmail.com',
        subject: `[Skelvy] ${subject}`,
        body: `



--------------------
App version: ${environment.version}
Manufacturer: ${this.device.manufacturer}
Model: ${this.device.model}
Platform: ${this.device.platform}
Version: ${this.device.version}
--------------------`,
      })
      .then(() => {
        this.toastService.createInformation(
          _(
            `If you have any further questions, don't hesitate to contact us by using our website`,
          ),
          10000,
        );
      });
  }

  rateInStore() {
    this.rate.preferences.storeAppURL = {
      ios: '1462518070',
      android: 'market://details?id=com.skelvy',
    };

    this.rate.navigateToAppStore();
  }

  async shareApp() {
    const checkOutText = await this.translateService
      .get(_('Check out Skelvy!'))
      .toPromise();

    const descriptionText = await this.translateService
      .get(
        _(`Join me on Skelvy! It is a mobile app for meetings over your favorite drinks.

You can find more information here:
https://skelvy.com`),
      )
      .toPromise();

    this.share.share(descriptionText, checkOutText);
  }

  openLink(url: string) {
    this.browser.create(url, '_system');
  }
}
