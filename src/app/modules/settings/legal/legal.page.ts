import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
})
export class LegalPage {
  constructor(private readonly browser: InAppBrowser) {}

  openLink(url: string) {
    this.browser.create(url, '_system');
  }
}
