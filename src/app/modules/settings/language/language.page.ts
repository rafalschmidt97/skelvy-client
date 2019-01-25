import { Component, OnInit } from '@angular/core';
import { Form } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import { Radio } from '../../../shared/form/radio/radio';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { LanguageConstants } from '../../../core/i18n/language.constants';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements Form, OnInit {
  form: FormGroup;
  isLoading = false;
  languages: Radio[] = [
    {
      value: 'pl',
      label: _('Polski'),
    },
    {
      value: 'en',
      label: _('English'),
    },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly storage: Storage,
  ) {
    this.form = this.formBuilder.group({
      language: [translateService.currentLang, Validators.required],
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
}
