import { Component } from '@angular/core';
import { Config, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageConstants } from './core/i18n/language.constants';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { storageKeys } from './core/storage/storage';
import { _ } from './core/i18n/translate';

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
    private readonly config: Config,
  ) {
    this.initializeApp().then(() => {
      console.warn('Skelvy has been initialized');
    });
  }

  async initializeApp() {
    await this.setLanguage();

    return this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.statusBar.styleDefault();
      } else {
        this.statusBar.styleLightContent();
      }

      this.splashScreen.hide();
    });
  }

  private async setLanguage() {
    this.translateService.addLangs(LanguageConstants.SUPPORTED_LANGUAGES);
    this.translateService.setDefaultLang(LanguageConstants.DEFAULT_LANGUAGE);

    let language = await this.storage.get(storageKeys.language);

    if (!language) {
      const browserLanguage = this.translateService.getBrowserLang();
      const languageToSet = browserLanguage.match(
        LanguageConstants.LANGUAGES_REGEX,
      )
        ? browserLanguage
        : LanguageConstants.DEFAULT_LANGUAGE;

      await this.storage.set(storageKeys.language, languageToSet);
      language = languageToSet;
    }

    this.translateService.use(language);
    moment.locale(language);

    if (this.platform.is('ios')) {
      this.translateService.onLangChange.subscribe(() => {
        this.config.set(
          'backButtonText',
          this.translateService.instant(_('Back')),
        );
      });
    }
  }
}
