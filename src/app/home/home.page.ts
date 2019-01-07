import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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
}
