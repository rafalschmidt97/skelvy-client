import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { _ } from '../common/i18n/translate';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  showAlertText = _('Show alert');

  constructor(
    private alertController: AlertController,
    private storage: Storage,
  ) {
    storage.set('name', 'Rafał');

    storage.get('name').then(val => {
      console.log(val);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'This is an alert message.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  showMonth() {
    const month = moment('22.04.1997', 'DD.MM.YYYY').format('MMMM');
    console.log(month);
  }
}
