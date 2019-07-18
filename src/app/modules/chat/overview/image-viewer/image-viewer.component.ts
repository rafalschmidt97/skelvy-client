import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit {
  @Input() src = '';
  slideOptions = {
    centeredSlides: 'true',
  };
  constructor(
    private readonly modalController: ModalController,
    private readonly statusBar: StatusBar,
  ) {}

  ngOnInit() {
    this.statusBar.hide();
  }

  closeModal() {
    this.statusBar.show();
    this.modalController.dismiss();
  }
}
