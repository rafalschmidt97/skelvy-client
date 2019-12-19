import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MeetingInvitation } from '../../../user/user';

@Component({
  selector: 'app-meeting-suggestions-modal',
  templateUrl: './meeting-invitation-modal.component.html',
  styleUrls: ['./meeting-invitation-modal.component.scss'],
})
export class MeetingInvitationModalComponent {
  @Input() invitation: MeetingInvitation;

  constructor(private readonly modalController: ModalController) {}

  join() {
    this.modalController.dismiss({
      invitationId: this.invitation.id,
      accept: true,
    });
  }

  remove() {
    this.modalController.dismiss({
      invitationId: this.invitation.id,
      accept: false,
    });
  }

  decline() {
    this.modalController.dismiss();
  }
}
