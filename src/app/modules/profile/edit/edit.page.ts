import { Component } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '../../../shared/form/select/select';
import { _ } from '../../../core/i18n/translate';
import { InputComponent } from '../../../shared/form/input/input.component';
import * as moment from 'moment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
})
export class EditPage implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;
  genders: Select[] = [
    {
      label: _('Male'),
      value: 'male',
    },
    {
      label: _('Female'),
      value: 'female',
    },
  ];
  adultDate = moment()
    .add(-18, 'years')
    .toDate();
  deathDate = moment()
    .add(-100, 'years')
    .toDate();

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      images: [
        [
          'https://via.placeholder.com/1000/ebebf0/ffffff?text=1',
          'https://via.placeholder.com/1000/ebebf0/ffffff?text=2',
          'https://via.placeholder.com/1000/ebebf0/ffffff?text=3',
        ],
        Validators.required,
      ],
      name: [
        'Rafał',
        [Validators.required, InputComponent.noWhitespaceValidation()],
      ],
      birthday: [
        moment('22.04.1997', 'DD.MM.YYYY').toDate(),
        Validators.required,
      ],
      gender: ['M', Validators.required],
      description: ['', InputComponent.noWhitespaceValidation()],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      console.log(this.form.value);

      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }
}
