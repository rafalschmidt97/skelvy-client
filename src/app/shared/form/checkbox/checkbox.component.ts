import { Component, forwardRef, Inject, Input, OnInit } from '@angular/core';
import { Checkbox } from './checkbox';
import { ComplexFieldComponent } from '../complex-field.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormComponent } from '../form.component';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends ComplexFieldComponent implements OnInit {
  @Input() options: Checkbox[];
  inputForm: FormGroup;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly formBuilder: FormBuilder,
  ) {
    super(parent);
  }

  get checkbox(): FormArray {
    return this.inputForm.get('checkbox') as FormArray;
  }

  static minimumSelectedValidation(min = 1) {
    return (control: FormControl) => {
      return control.value.length >= min ? null : { required: true };
    };
  }

  ngOnInit() {
    this.inputForm = this.formBuilder.group({
      checkbox: new FormArray(this.options.map(() => new FormControl(false))),
    });

    this.form.get(this.name).value.map(value => {
      const indexOfValue = this.options.findIndex(x => x.value === value);
      (<FormArray>this.inputForm.get('checkbox'))
        .at(indexOfValue)
        .patchValue(true);
    });

    this.inputForm.get('checkbox').valueChanges.subscribe(items => {
      // change boolean array to values from options
      const state = items
        .map((value, index) => (value ? this.options[index].value : null))
        .filter(value => value !== null);

      this.form.patchValue({
        [this.name]: state,
      });
    });
  }
}
