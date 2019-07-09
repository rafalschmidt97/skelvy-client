import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import {
  MeetingDto,
  MeetingRequestWithUserDto,
  MeetingSuggestionsModel,
} from '../../../modules/meeting/meeting';
import { Modal } from '../../modal/modal';
import { ModalService } from '../../modal/modal.service';

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
  @ViewChild('meetingPreview') meetingPreviewTemplate: TemplateRef<any>;
  @ViewChild('requestPreview') requestPreviewTemplate: TemplateRef<any>;
  previewMeeting: MeetingDto;
  previewRequest: MeetingRequestWithUserDto;
  previewModal: Modal;

  constructor(private readonly modalService: ModalService) {}

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }

  openMeetingDetails(previewMeeting: MeetingDto) {
    this.previewMeeting = previewMeeting;
    this.previewModal = this.modalService.show(this.meetingPreviewTemplate);
  }

  openRequestDetails(previewRequest: MeetingRequestWithUserDto) {
    this.previewRequest = previewRequest;
    this.previewModal = this.modalService.show(this.requestPreviewTemplate);
  }

  decline() {
    this.previewModal.hide();
  }

  connectRequest(requestId: number) {
    this.decline();
    this.connect.emit(requestId);
  }

  joinMeeting(meetingId: number) {
    this.decline();
    this.join.emit(meetingId);
  }
}
