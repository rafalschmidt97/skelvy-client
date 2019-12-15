import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FriendInvitation } from '../../../user/user';

@Component({
  selector: 'app-invitation-preview',
  templateUrl: './invitation-preview.component.html',
  styleUrls: ['./invitation-preview.component.scss'],
})
export class InvitationPreviewComponent {
  @Input() invitation: FriendInvitation;
  @Output() openInvitation = new EventEmitter<FriendInvitation>();
}
