import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FriendInvitation } from '../../../user/user';

@Component({
  selector: 'app-friend-invitation-preview',
  templateUrl: './friend-invitation-preview.component.html',
  styleUrls: ['./friend-invitation-preview.component.scss'],
})
export class FriendInvitationPreviewComponent {
  @Input() invitation: FriendInvitation;
  @Output() openInvitation = new EventEmitter<FriendInvitation>();
}
