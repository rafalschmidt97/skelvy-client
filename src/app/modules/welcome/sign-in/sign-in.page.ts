import { Component, TemplateRef } from '@angular/core';
import { Alert } from '../../../shared/alert/alert';
import { AlertService } from '../../../shared/alert/alert.service';
import { Modal } from '../../../shared/modal/modal';
import { ModalService } from '../../../shared/modal/modal.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  alert: Alert;
  modal: Modal;

  constructor(
    private readonly alertService: AlertService,
    private readonly modalService: ModalService,
  ) {}

  showAlert(template: TemplateRef<any>) {
    this.alert = this.alertService.show(template);
  }

  showModal(template: TemplateRef<any>) {
    this.modal = this.modalService.show(template);
  }

  confirmAlert() {
    this.alert.hide();
  }

  declineAlert() {
    this.alert.hide();
  }

  declineModal() {
    this.modal.hide();
  }
}
