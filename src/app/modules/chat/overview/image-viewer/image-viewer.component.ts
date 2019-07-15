import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent {
  @Input() src = '';
  slideOptions = {
    centeredSlides: 'true',
  };

  constructor(private readonly modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
