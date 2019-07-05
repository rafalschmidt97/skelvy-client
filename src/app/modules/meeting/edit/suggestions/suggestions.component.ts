import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasicFieldComponent } from '../../../../shared/form/basic-field.component';
import { MeetingSuggestionsModel } from '../../meeting';
import * as moment from 'moment';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
})
export class SuggestionsComponent extends BasicFieldComponent {
  @Input() suggestions: MeetingSuggestionsModel;
  @Output() join = new EventEmitter<number>();
  @Output() connect = new EventEmitter<number>();
  @Input() label: string;

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }
}
