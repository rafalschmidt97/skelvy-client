import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-legal-links-modal',
  templateUrl: './legal-links-modal.component.html',
})
export class LegalLinksModalComponent {
  constructor(
    private readonly browser: InAppBrowser,
    private readonly modalController: ModalController,
  ) {}

  openLink(url: string) {
    this.browser.create(url, '_system');
  }

  confirm() {
    this.modalController.dismiss();
  }
}
