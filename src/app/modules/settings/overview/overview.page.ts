import { Component, TemplateRef } from '@angular/core';
import { Alert } from '../../../shared/alert/alert';
import { AlertService } from '../../../shared/alert/alert.service';
import { NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { environment } from '../../../../environments/environment';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../../../core/auth/auth.service';
import { UserService } from '../../profile/user.service';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { LoadingService } from '../../../core/loading/loading.service';
import { UserSocketService } from '../../profile/user-socket.service';
import { UserPushService } from '../../profile/user-push.service';
import { UserStoreService } from '../../profile/user-store.service';
import { Device } from '@ionic-native/device/ngx';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  alert: Alert;
  version: string;
  loadingRemove = false;

  constructor(
    private readonly alertService: AlertService,
    private readonly routerNavigation: NavController,
    private readonly emailComposer: EmailComposer,
    private readonly authService: AuthService,
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly userSocket: UserSocketService,
    private readonly userStore: UserStoreService,
    private readonly userPush: UserPushService,
    private readonly device: Device,
    private readonly storage: Storage,
    private readonly browser: InAppBrowser,
  ) {
    this.version = environment.version;
  }

  open(template: TemplateRef<any>) {
    this.alert = this.alertService.show(template);
  }

  confirmLogout() {
    this.userSocket.disconnect();
    this.userPush.disconnect();

    this.logout().then(() => {
      this.alert.hide();
      this.routerNavigation.navigateBack(['/home']);
      setTimeout(() => {
        this.toastService.createInformation(_('Successfully logged out'));
      }, 1000);
    });
  }

  confirmRemove() {
    this.loadingRemove = true;
    this.loadingService.lock();
    this.userSocket.disconnect();

    this.userService.removeUser().subscribe(
      () => {
        this.userPush.disconnect();

        this.logout().then(() => {
          this.alert.hide();
          this.loadingService.unlock();
          this.routerNavigation.navigateBack(['/home']);
          setTimeout(() => {
            this.toastService.createInformation(
              _('The account has been successfully deleted'),
            );
          }, 1000);
        });
      },
      () => {
        this.userSocket.connect();
        this.alert.hide();
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while deleting the account'),
        );
        this.loadingRemove = false;
      },
    );
  }

  decline() {
    this.alert.hide();
  }

  sendReport() {
    this.emailComposer
      .open({
        to: 'contact.skelvy@gmail.com',
        subject: '[skelvy] Report a bug',
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
          0,
        );
      });
  }

  openLink(url: string) {
    this.browser.create(url, '_system');
  }

  private async logout() {
    await this.authService.logout();
    const method = await this.storage.get('signInMethod');
    console.log(method);

    if (method === 'facebook') {
      await this.facebook.logout();
    } else if (method === 'google') {
      await this.google.logout();
    }

    await this.storage.remove('signInMethod');
  }
}
