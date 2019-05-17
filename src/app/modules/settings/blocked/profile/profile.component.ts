import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../../user/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() user: UserDto;
  @Output() openDetails = new EventEmitter<UserDto>();
}
