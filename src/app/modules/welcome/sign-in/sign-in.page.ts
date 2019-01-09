import { Component, TemplateRef } from '@angular/core';
import { Alert } from '../../../shared/alert/alert';
import { AlertService } from '../../../shared/alert/alert.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  alert: Alert;

  constructor(private readonly alertService: AlertService) {}

  showAlert(template: TemplateRef<any>) {
    this.alert = this.alertService.show(template);
  }

  confirm() {
    this.decline();
  }

  decline() {
    this.alert.hide();
  }
}
