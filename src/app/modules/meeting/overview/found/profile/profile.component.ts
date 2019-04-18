import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingUserDto } from '../../../meeting';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() user: MeetingUserDto;
  @Output() openDetails = new EventEmitter<MeetingUserDto>();
}
