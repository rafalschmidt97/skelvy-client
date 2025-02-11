import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {
  LanguageConstants,
  LanguageRadio,
} from '../../../core/i18n/language.constants';
import { UserService } from '../../user/user.service';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { NavController } from '@ionic/angular';
import { storageKeys } from '../../../core/storage/storage';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  languages = LanguageRadio;
  initializedLanguage: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly storage: Storage,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly routerNavigation: NavController,
  ) {
    this.initializedLanguage = translateService.currentLang;
    this.form = this.formBuilder.group({
      language: [this.initializedLanguage, Validators.required],
    });
  }

  ngOnInit() {
    this.form.get(storageKeys.language).valueChanges.subscribe(async value => {
      const language = value.match(LanguageConstants.LANGUAGES_REGEX)
        ? value
        : LanguageConstants.DEFAULT_LANGUAGE;

      await this.storage.set(storageKeys.language, language);
      this.translateService.use(language);
      moment.locale(language);
    });
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      const form = this.form.value;

      if (this.initializedLanguage !== form.language) {
        this.isLoading = true;
        this.userService.updateLanguage(form.language).subscribe(
          () => {
            this.isLoading = false;
            this.routerNavigation.navigateBack(['/app/settings']);
          },
          () => {
            this.isLoading = false;
            this.routerNavigation.navigateBack(['/app/settings']);
            this.toastService.createError(
              _('A problem occurred while updating the language'),
            );
          },
        );
      } else {
        this.routerNavigation.navigateBack(['/app/settings']);
      }
    }
  }
}
