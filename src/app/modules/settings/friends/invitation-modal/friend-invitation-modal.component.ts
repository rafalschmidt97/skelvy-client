import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FriendInvitation } from '../../../user/user';

@Component({
  selector: 'app-friend-invitation-modal',
  templateUrl: './friend-invitation-modal.component.html',
  styleUrls: ['./friend-invitation-modal.component.scss'],
})
export class FriendInvitationModalComponent {
  @Input() invitation: FriendInvitation;

  constructor(private readonly modalController: ModalController) {}

  accept() {
    this.modalController.dismiss({
      invitationId: this.invitation.id,
      accept: true,
    });
  }

  reject() {
    this.modalController.dismiss({
      invitationId: this.invitation.id,
      accept: false,
    });
  }

  decline() {
    this.modalController.dismiss();
  }
}
