import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MeetingWithUsersDto } from '../../../meetings/meetings';

@Component({
  selector: 'app-meeting-suggestions-modal',
  templateUrl: './meeting-suggestions-modal.component.html',
  styleUrls: ['./meeting-suggestions-modal.component.scss'],
})
export class MeetingSuggestionsModalComponent {
  @Input() meeting: MeetingWithUsersDto;

  constructor(private readonly modalController: ModalController) {}

  joinMeeting(meetingId: number) {
    this.modalController.dismiss({ meetingId });
  }

  decline() {
    this.modalController.dismiss();
  }
}
