import { Component, TemplateRef } from '@angular/core';
import { Alert } from '../../../shared/alert/alert';
import { AlertService } from '../../../shared/alert/alert.service';
import { NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  alert: Alert;

  constructor(
    private readonly alertService: AlertService,
    private readonly routerNavigation: NavController,
    private readonly emailComposer: EmailComposer,
  ) {}

  open(template: TemplateRef<any>) {
    this.alert = this.alertService.show(template);
  }

  confirmLogout() {
    // TODO: auth logout
    this.alert.hide();
    this.routerNavigation.navigateBack(['/welcome/sign-in']);
    // this.router.navigate(['/welcome/sign-in']);
  }

  confirmDelete() {
    // TODO: block ui, delete account
    this.confirmLogout();
  }

  decline() {
    this.alert.hide();
  }

  sendReport() {
    this.emailComposer.hasPermission().then(hasPermission => {
      if (hasPermission) {
        this.emailComposer.open({
          to: 'rafalschmidt97@gmail.com',
          subject: '[skelvy] Report a bug',
        });
      }
    });
  }
}
