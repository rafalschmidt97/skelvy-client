import { forwardRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormComponent } from './form.component';

export abstract class BasicFieldComponent {
  constructor(
    @Inject(forwardRef(() => FormComponent))
    protected readonly parent: FormComponent,
  ) {}

  get form(): FormGroup {
    return this.parent.form;
  }

  get isLoading(): boolean {
    return this.parent.isLoading;
  }
}
