import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LocaleSettings } from 'primeng/primeng';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
})
export class CalendarModalComponent implements OnInit {
  @Input() value;
  @Input() min: Date;
  @Input() max: Date;
  name = 'calendar';
  inputForm: FormGroup;
  locale: LocaleSettings = {
    firstDayOfWeek: moment.localeData().firstDayOfWeek(),
    dayNames: moment.weekdays(),
    dayNamesShort: moment.weekdaysShort(),
    dayNamesMin: moment.weekdaysMin(),
    monthNames: moment.months('MMMM'),
    monthNamesShort: moment.weekdaysShort(),
    today: '',
    clear: '',
  };
  today = new Date();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly modalController: ModalController,
  ) {}

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      [this.name]: this.value,
    });

    this.inputForm.get(this.name).valueChanges.subscribe(value => {
      if (value[1] && value[0] === value[1]) {
        this.inputForm.patchValue({
          [this.name]: [value[0], null],
        });
      }
    });
  }

  confirm() {
    this.modalController.dismiss({
      value: this.inputForm.get(this.name).value,
    });
  }

  decline() {
    this.modalController.dismiss();
  }
}
