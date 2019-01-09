import { Component, TemplateRef } from '@angular/core';
import { Alert } from '../../../shared/alert/alert';
import { AlertService } from '../../../shared/alert/alert.service';
import { Modal } from '../../../shared/modal/modal';
import { ModalService } from '../../../shared/modal/modal.service';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { Iframe } from '../../../shared/iframe/iframe';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  alert: Alert;
  modal: Modal;
  iframe: Iframe;

  constructor(
    private readonly alertService: AlertService,
    private readonly modalService: ModalService,
    private readonly iframeService: IframeService,
  ) {}

  showAlert(template: TemplateRef<any>) {
    this.alert = this.alertService.show(template);
  }

  showModal(template: TemplateRef<any>) {
    this.modal = this.modalService.show(template);
  }

  showIframe(template: TemplateRef<any>) {
    this.iframe = this.iframeService.show(template);
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

  declineIframe() {
    this.iframe.hide();
  }
}
