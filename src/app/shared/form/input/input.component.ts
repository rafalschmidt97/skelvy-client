import { Component, Input } from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends ComplexFieldComponent {
  @Input() isPassword: boolean;
  @Input() isEmail: boolean;
  @Input() placeholder = '';

  get hasErrorEmail(): boolean {
    return this.form.get(this.name).hasError('email');
  }

  get hasErrorEqual(): boolean {
    return this.form.get(this.name).hasError('equal');
  }

  static noWhitespaceValidation() {
    return (control: FormControl) => {
      return control.value.length > 0 &&
        (control.value || '').trim().length === 0
        ? { required: true }
        : null;
    };
  }
}
