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
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent extends ComplexFieldComponent implements OnInit {
  @Input() range: boolean;
  @Input() min: number;
  @Input() max: number;
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
  modal: Modal;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly modalService: ModalService,
    private readonly formBuilder: FormBuilder,
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

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      [this.name]: [],
    });

    this.inputForm.get(this.name).valueChanges.subscribe(value => {
      if (value[1] && value[0] === value[1]) {
        this.inputForm.patchValue({
          [this.name]: [value[0], null],
        });
      }
    });
  }

  open(template: TemplateRef<any>) {
    const value = this.form.get(this.name).value;

    this.inputForm.patchValue({
      [this.name]: value,
    });

    if (!this.isLoading) {
      this.modal = this.modalService.show(template);
    }
  }

  confirm() {
    this.form.markAsDirty();
    this.form.markAsTouched();
    const value = this.inputForm.get(this.name).value;
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

    this.modal.hide();
  }

  decline() {
    this.modal.hide();
  }
}
