import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { MeetingSuggestionsModel } from '../../../modules/meeting/meeting';

@Component({
  selector: 'app-meeting-suggestions',
  templateUrl: './meeting-suggestions.component.html',
  styleUrls: ['./meeting-suggestions.component.scss'],
})
export class MeetingSuggestionsComponent {
  @Input() suggestions: MeetingSuggestionsModel;
  @Input() inForm: boolean;
  @Input() isLoading: boolean;
  @Output() join = new EventEmitter<number>();
  @Output() connect = new EventEmitter<number>();

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }
}
