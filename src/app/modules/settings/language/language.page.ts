import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Radio } from '../../../shared/form/radio/radio';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { LanguageConstants } from '../../../core/i18n/language.constants';
import { UserService } from '../../profile/user.service';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  languages: Radio[] = [
    {
      value: 'pl',
      label: 'Polski',
    },
    {
      value: 'en',
      label: 'English',
    },
  ];
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
    this.form.get('language').valueChanges.subscribe(value => {
      const language = value.match(LanguageConstants.LANGUAGES_REGEX)
        ? value
        : LanguageConstants.DEFAULT_LANGUAGE;

      this.storage.set('language', language);
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
            this.routerNavigation.navigateBack(['/app/tabs/more']);
          },
          () => {
            this.isLoading = false;
            this.toastService.createError(
              _('A problem occurred while updating the language'),
            );
          },
        );
      } else {
        this.routerNavigation.navigateBack(['/app/tabs/more']);
      }
    }
  }
}
