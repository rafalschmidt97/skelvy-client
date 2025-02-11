import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingInvitation } from '../../../user/user';
import { GroupUserDto, MeetingWithUsersDto } from '../../meetings';

@Component({
  selector: 'app-meeting-invitation-preview',
  templateUrl: './meeting-invitation-preview.component.html',
  styleUrls: ['./meeting-invitation-preview.component.scss'],
})
export class MeetingInvitationPreviewComponent {
  @Input() invitation: MeetingInvitation;
  @Output() openInvitation = new EventEmitter<MeetingInvitation>();

  getGroupName(meeting: MeetingWithUsersDto): string {
    return meeting.name || meeting.users.map(x => x.profile.name).join(', ');
  }

  getFirstUsers(users: GroupUserDto[]): GroupUserDto[] {
    return users.slice(0, 4);
  }
}
