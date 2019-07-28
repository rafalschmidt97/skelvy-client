import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import {
  MeetingDto,
  MeetingRequestWithUserDto,
  MeetingSuggestionsModel,
} from '../../../modules/meeting/meeting';
import { RequestSuggestionsModalComponent } from './request/request-suggestions-modal.component';
import { MeetingSuggestionsModalComponent } from './meeting/meeting-suggestions-modal.component';
import { ModalController } from '@ionic/angular';

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

  constructor(private readonly modalController: ModalController) {}

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }

  async openMeetingDetails(previewMeeting: MeetingDto) {
    const modal = await this.modalController.create({
      component: MeetingSuggestionsModalComponent,
      componentProps: {
        meeting: previewMeeting,
      },
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data.meetingId) {
      this.join.emit(data.meetingId);
    }
  }

  async openRequestDetails(previewRequest: MeetingRequestWithUserDto) {
    const modal = await this.modalController.create({
      component: RequestSuggestionsModalComponent,
      componentProps: {
        request: previewRequest,
      },
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data.requestId) {
      this.connect.emit(data.requestId);
    }
  }
}
