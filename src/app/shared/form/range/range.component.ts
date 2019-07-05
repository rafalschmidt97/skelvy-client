import { Component, Input, OnInit } from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
})
export class RangeComponent extends ComplexFieldComponent implements OnInit {
  @Input() range: boolean;
  @Input() min: number;
  @Input() max: number;
  @Input() maxLabelToRound: string;
  @Input() maxValueToRound: number;
  slider: any;

  get hasErrorTight(): boolean {
    return this.form.get(this.name).hasError('tight');
  }

  static minimumRangeValidator(min = 4) {
    return (control: FormControl) => {
      return !(control.value[1] - control.value[0] < min)
        ? null
        : { tight: true };
    };
  }

  ngOnInit() {
    this.slider = this.form.get(this.name).value;
  }

  onChange(e) {
    if (this.range) {
      this.form.patchValue({
        [this.name]: e.values,
      });
    } else {
      this.form.patchValue({
        [this.name]: e.value,
      });
    }
  }
}
