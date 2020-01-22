import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../../user/user';

@Component({
  selector: 'app-search-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss'],
})
export class ProfilePreviewComponent {
  @Input() user: UserDto;
  @Output() openDetails = new EventEmitter<UserDto>();
}
