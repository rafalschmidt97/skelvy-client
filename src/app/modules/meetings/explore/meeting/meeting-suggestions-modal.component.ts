import { Component, Input } from '@angular/core';
import { MeetingWithUsersDto } from '../../meetings';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-meeting-suggestions-modal',
  templateUrl: './meeting-suggestions-modal.component.html',
  styleUrls: ['./meeting-suggestions-modal.component.scss'],
})
export class MeetingSuggestionsModalComponent {
  @Input() meeting: MeetingWithUsersDto;

  constructor(private readonly modalController: ModalController) {}

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }

  joinMeeting(meetingId: number) {
    this.modalController.dismiss({ meetingId });
  }

  decline() {
    this.modalController.dismiss();
  }
}
