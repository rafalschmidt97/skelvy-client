import { Component, Input } from '@angular/core';
import { MeetingRequestWithUserDto } from '../../meetings';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-request-suggestions-modal',
  templateUrl: './request-suggestions-modal.component.html',
  styleUrls: ['./request-suggestions-modal.component.scss'],
})
export class RequestSuggestionsModalComponent {
  @Input() request: MeetingRequestWithUserDto;

  constructor(private readonly modalController: ModalController) {}

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }

  connectRequest(requestId: number) {
    this.modalController.dismiss({ requestId });
  }

  decline() {
    this.modalController.dismiss();
  }
}
