import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../../user/user';
import { GroupUserDto } from '../../meetings';

@Component({
  selector: 'app-details-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss'],
})
export class ProfilePreviewComponent {
  @Input() user: GroupUserDto;
  @Output() openDetails = new EventEmitter<UserDto>();
}
