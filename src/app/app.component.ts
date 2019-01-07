import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageConstants } from './common/i18n/language.constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
  ) {
    this.initializeApp();
    this.setLanguage();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private setLanguage() {
    this.translateService.addLangs(LanguageConstants.SUPPORTED_LANGUAGES);
    this.translateService.setDefaultLang(LanguageConstants.DEFAULT_LANGUAGE);

    // TODO: ADD STORAGE HERE
    // const language = this.storage.getItem('language');

    let language = LanguageConstants.DEFAULT_LANGUAGE;

    if (language) {
      language = language.match(LanguageConstants.LANGUAGES_REGEX)
        ? language
        : LanguageConstants.DEFAULT_LANGUAGE;
    } else {
      const browserLanguage = this.translateService.getBrowserLang();
      language = browserLanguage.match(LanguageConstants.LANGUAGES_REGEX)
        ? browserLanguage
        : LanguageConstants.DEFAULT_LANGUAGE;
    }

    this.translateService.use(language);
    // TODO: ADD STORAGE HERE
    // this.storage.setItem('language', newLanguage);
    // TODO: ADD MOMENT HERE
    // moment.locale(newLanguage);
  }
}
