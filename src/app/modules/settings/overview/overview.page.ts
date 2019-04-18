import { Component, TemplateRef } from '@angular/core';
import { Alert } from '../../../shared/alert/alert';
import { AlertService } from '../../../shared/alert/alert.service';
import { NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { UserSocketService } from '../../profile/user-socket.service';
import { UserPushService } from '../../profile/user-push.service';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  alert: Alert;
  version: string;
  loadingLogout: boolean;

  constructor(
    private readonly alertService: AlertService,
    private readonly routerNavigation: NavController,
    private readonly emailComposer: EmailComposer,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly userSocket: UserSocketService,
    private readonly userPush: UserPushService,
    private readonly device: Device,
    private readonly browser: InAppBrowser,
  ) {
    this.version = environment.version;
  }

  open(template: TemplateRef<any>) {
    this.alert = this.alertService.show(template);
  }

  confirmLogout() {
    this.loadingLogout = true;
    this.userSocket.disconnect();
    this.userPush.disconnect();

    this.authService.logout().subscribe(
      () => {
        this.alert.hide();
        this.routerNavigation.navigateBack(['/home']);
        setTimeout(() => {
          this.toastService.createInformation(_('Successfully logged out'));
        }, 1000);
      },
      () => {
        this.authService.logoutWithoutRequest().then(() => {
          this.alert.hide();
          this.routerNavigation.navigateBack(['/home']);
          setTimeout(() => {
            this.toastService.createInformation(
              _('A problem occurred while logging out'),
            );
          }, 1000);
        });
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
}
