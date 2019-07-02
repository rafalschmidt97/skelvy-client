import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-loading',
  templateUrl: './profile-loading.component.html',
  styleUrls: ['./profile-loading.component.scss'],
})
export class ProfileLoadingComponent {
  @Input() missing: any[];
}
