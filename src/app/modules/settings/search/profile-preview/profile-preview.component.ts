import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserWithRoleDto } from '../../../user/user';

@Component({
  selector: 'app-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss'],
})
export class ProfilePreviewComponent {
  @Input() user: UserWithRoleDto;
  @Output() openDetails = new EventEmitter<UserWithRoleDto>();
}
