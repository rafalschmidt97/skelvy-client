import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingUser } from '../../../meeting';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() user: MeetingUser;
  @Output() openDetails = new EventEmitter<MeetingUser>();
}
