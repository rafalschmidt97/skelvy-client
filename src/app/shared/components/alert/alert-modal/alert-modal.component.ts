import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
})
export class AlertModalComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() confirmText: string;
  @Input() confirmLoading = false;
  @Input() declineText: string;

  constructor(private readonly modalController: ModalController) {}

  confirm() {
    this.modalController.dismiss({ response: true });
  }

  decline() {
    this.modalController.dismiss({ response: false });
  }
}
