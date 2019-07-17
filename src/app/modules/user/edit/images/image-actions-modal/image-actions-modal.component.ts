import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-actions-modal',
  templateUrl: './image-actions-modal.component.html',
})
export class ImageActionsModalComponent {
  constructor(private readonly modalController: ModalController) {}

  decline() {
    this.modalController.dismiss();
  }

  choose() {
    this.modalController.dismiss({ choose: true });
  }

  take() {
    this.modalController.dismiss({ take: true });
  }
}
