import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import * as moment from 'moment';
import { Checkbox } from '../../../shared/form/checkbox/checkbox';
import { RangeComponent } from '../../../shared/form/range/range.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
})
export class EditPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  drinks: Checkbox[] = [
    {
      value: '1',
      label: _('Tea'),
    },
    {
      value: '2',
      label: _('Chocolate'),
    },
    {
      value: '3',
      label: _('Coffee'),
    },
    {
      value: '4',
      label: _('Beer'),
    },
    {
      value: '5',
      label: _('Wine'),
    },
    {
      value: '6',
      label: _('Vodka'),
    },
    {
      value: '7',
      label: _('Whiskey'),
    },
  ];
  today = moment()
    .startOf('day') // set to 12:00 am today
    .toDate();
  tomorrow = moment()
    .startOf('day')
    .add(1, 'days')
    .toDate();

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      date: [[this.today, this.tomorrow], Validators.required],
      address: ['', Validators.required],
      age: [[18, 25], RangeComponent.minimumRangeValidator(4)],
      drinks: [[this.drinks[0].value], Validators.required],
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

  ngOnInit() {
    // TODO: fill address based on our location
  }
}
