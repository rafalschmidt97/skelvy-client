import { Component, Input } from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';
import { Select } from './select';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent extends ComplexFieldComponent {
  @Input() placeholder: string;
  @Input() options: Select[];
}
