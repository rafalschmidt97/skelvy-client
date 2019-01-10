import { Input } from '@angular/core';
import { BasicFieldComponent } from './basic-field.component';

export abstract class ComplexFieldComponent extends BasicFieldComponent {
  @Input() name: string;
  @Input() label: string;
  @Input() hasFeedback = true;

  get isInvalid(): boolean {
    return this.form.get(this.name).invalid;
  }

  get isTouched(): boolean {
    return this.form.get(this.name).touched;
  }

  get isDirty(): boolean {
    return this.form.get(this.name).dirty;
  }

  get hasErrorRequired(): boolean {
    return this.form.get(this.name).hasError('required');
  }
}
