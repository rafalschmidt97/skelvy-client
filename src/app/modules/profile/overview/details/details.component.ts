import { Component, Input } from '@angular/core';
import { Profile } from '../../profile';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input() profile: Profile;
}
