import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-missing',
  templateUrl: './profile-missing.component.html',
  styleUrls: ['./profile-missing.component.scss'],
})
export class ProfileMissingComponent {
  @Input() size: number;
  @Input() length: number;
  @Input() isHidden: boolean;

  get missing(): number {
    return this.size - this.length;
  }

  get displayMissing(): number {
    return this.size - this.length < 4 ? this.size - this.length : 4;
  }
}
