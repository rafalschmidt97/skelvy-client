import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageConstants } from './core/i18n/language.constants';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly translateService: TranslateService,
    private readonly storage: Storage,
  ) {
    this.initializeApp();
    this.setLanguage();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#fff');
      }

      this.splashScreen.hide();
    });
  }

  private setLanguage() {
    this.translateService.addLangs(LanguageConstants.SUPPORTED_LANGUAGES);
    this.translateService.setDefaultLang(LanguageConstants.DEFAULT_LANGUAGE);

    this.storage.get('language').then(language => {
      if (!language) {
        const browserLanguage = this.translateService.getBrowserLang();
        language = browserLanguage.match(LanguageConstants.LANGUAGES_REGEX)
          ? browserLanguage
          : LanguageConstants.DEFAULT_LANGUAGE;

        this.storage.set('language', language);
      }

      this.translateService.use(language);
      moment.locale(language);
    });
  }
}
