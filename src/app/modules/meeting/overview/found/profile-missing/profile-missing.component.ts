import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-missing',
  templateUrl: './profile-missing.component.html',
  styleUrls: ['./profile-missing.component.scss'],
})
export class ProfileMissingComponent {
  @Input() missing: any[];
}
