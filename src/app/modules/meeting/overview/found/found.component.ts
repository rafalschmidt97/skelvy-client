import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Meeting, MeetingUser } from '../../meeting';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Profile, User } from '../../../profile/profile';
import { Modal } from '../../../../shared/modal/modal';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';

@Component({
  selector: 'app-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.scss'],
})
export class FoundComponent {
  @Input() meeting: Meeting;
  @Input() user: User;
  @Output() leaveMeeting = new EventEmitter();
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  profileForModal: Profile;
  modal: Modal;
  alert: Alert;

  constructor(
    private readonly modalService: ModalService,
    private readonly alertService: AlertService,
  ) {}

  get filteredMeetingUsers(): MeetingUser[] {
    return this.meeting.users.filter(user => user.id !== this.user.id);
  }

  openDetails(user: MeetingUser) {
    this.profileForModal = user.profile;
    this.modal = this.modalService.show(this.detailsTemplate);
  }

  leaveGroup() {
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmDetails() {
    this.modal.hide();
  }

  confirmAlert() {
    this.alert.hide();
    this.leaveMeeting.emit();
  }

  declineAlert() {
    this.alert.hide();
  }
}
