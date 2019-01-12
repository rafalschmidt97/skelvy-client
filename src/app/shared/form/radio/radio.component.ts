import { Component, Input } from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';
import { Radio } from './radio';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent extends ComplexFieldComponent {
  @Input() options: Radio[];
}
