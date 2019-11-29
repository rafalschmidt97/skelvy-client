import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocaleSettings } from 'primeng/primeng';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
})
export class CalendarModalComponent {
  @Input() value;
  @Input() min: Date;
  @Input() max: Date;
  @Input() range: boolean;

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

  constructor(private readonly modalController: ModalController) {}

  confirm() {
    const value = this.value;
    if (this.range) {
      if (value[1] && value[0] === value[1]) {
        value[1] = null;
      }
    }
    this.modalController.dismiss({ value });
  }

  decline() {
    this.modalController.dismiss();
  }
}
