import { Component, Input } from '@angular/core';
import { ProfileDto } from '../../user';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input() profile: ProfileDto;
}
