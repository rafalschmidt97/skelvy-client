import { FormArray, FormGroup } from '@angular/forms';

export interface Form {
  form: FormGroup;
  isLoading: boolean;
}

export interface OnSubmit {
  onSubmit(): void;
}

export function markControlsDirty(group: FormGroup | FormArray): void {
  Object.keys(group.controls).forEach((key: string) => {
    const abstractControl = group.controls[key];

    if (
      abstractControl instanceof FormGroup ||
      abstractControl instanceof FormArray
    ) {
      this.markControlsDirty(abstractControl);
    } else {
      abstractControl.markAsDirty();
    }
  });
}
