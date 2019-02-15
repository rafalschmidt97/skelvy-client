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

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  alert: Alert;
  version: string;
  loadingDelete = false;

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
  ) {
    this.version = environment.version;
  }

  open(template: TemplateRef<any>) {
    this.alert = this.alertService.show(template);
  }

  confirmLogout() {
    this.logout().then(() => {
      this.alert.hide();
      this.routerNavigation.navigateBack(['/welcome/sign-in']);
      setTimeout(() => {
        this.toastService.createInformation(_('Successfully logged out'));
      }, 1000);
    });
  }

  confirmDelete() {
    this.loadingDelete = true;
    this.loadingService.lock();
    this.userService.deleteUser().subscribe(
      () => {
        this.logout().then(() => {
          this.alert.hide();
          this.loadingService.unlock();
          this.routerNavigation.navigateBack(['/welcome/sign-in']);
          setTimeout(() => {
            this.toastService.createInformation(
              _('Account successfully deleted'),
            );
          }, 1000);
        });
      },
      () => {
        this.alert.hide();
        this.loadingService.unlock();
        this.toastService.createError(_('Something went wrong'));
        this.loadingDelete = false;
      },
    );
  }

  decline() {
    this.alert.hide();
  }

  sendReport() {
    this.emailComposer.open({
      to: 'rafalschmidt97@gmail.com',
      subject: '[skelvy] Report a bug',
    });
  }

  private async logout() {
    await this.authService.logout();
    await this.facebook.logout();
    await this.google.logout();
  }
}
