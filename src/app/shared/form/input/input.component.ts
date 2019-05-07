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
    return this.form.get(this.name).hasError('email') && !this.hasErrorRequired;
  }

  get hasErrorEqual(): boolean {
    return this.form.get(this.name).hasError('equal');
  }

  get hasErrorMinLength(): boolean {
    return (
      this.form.get(this.name).hasError('minlength') && !this.hasErrorRequired
    );
  }

  get hasErrorMaxLength(): boolean {
    return this.form.get(this.name).hasError('maxlength');
  }

  get hasErrorMaxEndline(): boolean {
    return (
      this.form.get(this.name).hasError('maxendline') && !this.hasErrorRequired
    );
  }

  get hasErrorMaxWhiteSpaces(): boolean {
    return (
      this.form.get(this.name).hasError('maxwhitespaces') &&
      !this.hasErrorRequired
    );
  }

  get hasErrorRegexp(): boolean {
    return (
      this.form.get(this.name).hasError('regexp') && !this.hasErrorRequired
    );
  }

  static noWhitespaceValidation() {
    return (control: FormControl) => {
      return control.value.length > 0 &&
        (control.value || '').trim().length === 0
        ? { required: true }
        : null;
    };
  }

  static maxEndline(amount: number) {
    return (control: FormControl) => {
      const lines = control.value.split(/\r\n|\r|\n/).length - 1;
      return lines > amount ? { maxendline: true } : null;
    };
  }

  static maxWhiteSpaces(amount: number) {
    return (control: FormControl) => {
      const spaces = control.value.split(/\s/).length - 1;
      return spaces > amount ? { maxwhitespaces: true } : null;
    };
  }

  static regex(regExp: RegExp) {
    return (control: FormControl) => {
      return control.value !== '' && !control.value.match(regExp)
        ? { regexp: true }
        : null;
    };
  }
}
