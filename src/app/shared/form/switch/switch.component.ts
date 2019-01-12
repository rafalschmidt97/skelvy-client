import { Component, Input } from '@angular/core';
import { BasicFieldComponent } from '../basic-field.component';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent extends BasicFieldComponent {
  @Input() name: string;
}
