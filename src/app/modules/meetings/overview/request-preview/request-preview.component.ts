import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingRequestDto } from '../../meetings';
import * as moment from 'moment';

@Component({
  selector: 'app-request-preview',
  templateUrl: './request-preview.component.html',
  styleUrls: ['./request-preview.component.scss'],
})
export class RequestPreviewComponent {
  @Input() request: MeetingRequestDto;
  @Output() openRemoveRequest = new EventEmitter<number>();

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }
}
