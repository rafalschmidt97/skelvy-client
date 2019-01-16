import { Component, Input } from '@angular/core';
import { Profile } from '../../../../profile/profile';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  @Input() profile: Profile;
}
