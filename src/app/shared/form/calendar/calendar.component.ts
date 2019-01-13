import {
  Component,
  forwardRef,
  Inject,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';
import { LocaleSettings } from 'primeng/primeng';
import * as moment from 'moment';
import { FormComponent } from '../form.component';
import { Modal } from '../../modal/modal';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent extends ComplexFieldComponent implements OnInit {
  @Input() range: boolean;
  @Input() min: number;
  @Input() max: number;

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
  modal: Modal;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly modalService: ModalService,
  ) {
    super(parent);
  }

  get dateLabel(): string {
    const start = this.form.get(this.name).value[0];
    const end = this.form.get(this.name).value[1] || null;

    if (end) {
      return `${moment(start).format('DD.MM.YYYY')} - ${moment(end).format(
        'DD.MM.YYYY',
      )}`;
    }

    return moment(start).format('DD.MM.YYYY');
  }

  ngOnInit() {
    this.form.get(this.name).valueChanges.subscribe((value: Date[]) => {
      const hasSameDates =
        value[1] && value[0].getTime() === value[1].getTime();
      if (hasSameDates) {
        this.form.patchValue({
          [this.name]: [value[0], null],
        });
      }
    });
  }

  open(template: TemplateRef<any>) {
    if (!this.isLoading) {
      this.modal = this.modalService.show(template, {
        ignoreBackdropClick: true,
        keyboard: false,
      });
    }
  }

  confirm() {
    this.modal.hide();
  }

  decline() {
    this.modal.hide();
  }
}
