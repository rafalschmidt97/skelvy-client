import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingInvitation } from '../../../user/user';
import { GroupState, GroupUserDto, MeetingDto } from '../../meetings';

@Component({
  selector: 'app-meeting-preview',
  templateUrl: './meeting-preview.component.html',
  styleUrls: ['./meeting-preview.component.scss'],
})
export class MeetingPreviewComponent {
  @Input() meeting: MeetingDto;
  @Input() group: GroupState;

  getFirstUsers(users: GroupUserDto[]): GroupUserDto[] {
    return users.slice(0, 4);
  }
}
