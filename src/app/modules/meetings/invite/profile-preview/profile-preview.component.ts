import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../../user/user';

@Component({
  selector: 'app-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss'],
})
export class ProfilePreviewComponent {
  @Input() user: UserDto;
  @Output() invite = new EventEmitter<number>();
  isLoading: boolean;

  inviteFriend() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.invite.emit(this.user.id);
    }
  }
}
