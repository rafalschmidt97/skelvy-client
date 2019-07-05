import { Component, Input, OnInit } from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';
import * as moment from 'moment';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent extends ComplexFieldComponent implements OnInit {
  @Input() min: Date;
  @Input() max: Date;
  minIso: string;
  maxIso: string;
  datePicker: string;
  dayNames = moment.weekdays();
  dayNamesShort = moment.weekdaysShort();
  monthNames = moment.months('MMMM');
  monthNamesShort = moment.weekdaysShort();

  get dateLabel(): string {
    const start = this.form.get(this.name).value;
    return moment(start).format('DD.MM.YYYY');
  }

  ngOnInit() {
    this.datePicker = moment(this.form.get(this.name).value).format();
    this.minIso = moment(this.min).format();
    this.maxIso = moment(this.max).format();
  }

  onChange() {
    this.form.patchValue({
      [this.name]: moment(this.datePicker).toDate(),
    });
  }
}
