import { Component, forwardRef, Inject, Input } from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';
import * as moment from 'moment';
import { FormComponent } from '../form.component';
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent extends ComplexFieldComponent {
  @Input() range: boolean;
  @Input() min: Date;
  @Input() max: Date;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly modalController: ModalController,
  ) {
    super(parent);
  }

  get dateLabel(): string {
    const start = this.form.get(this.name).value[0];
    const end = this.form.get(this.name).value[1];

    if (end) {
      return `${moment(start).format('DD.MM.YYYY')} - ${moment(end).format(
        'DD.MM.YYYY',
      )}`;
    }

    return moment(start).format('DD.MM.YYYY');
  }

  async open() {
    if (!this.isLoading) {
      const value = this.form.get(this.name).value;

      const modal = await this.modalController.create({
        component: CalendarModalComponent,
        componentProps: {
          value,
          min: this.min,
          max: this.max,
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.value) {
        this.confirm(data.value);
      }
    }
  }

  confirm(value) {
    this.form.markAsDirty();
    this.form.markAsTouched();
    value[0].setHours(0, 0, 0, 0);

    if (value[1]) {
      this.form.patchValue({
        [this.name]: [value[0], value[1]],
      });
    } else {
      this.form.patchValue({
        [this.name]: [value[0]],
      });
    }
  }
}
