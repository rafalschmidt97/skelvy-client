import { Component, Input } from '@angular/core';
import { ComplexFieldComponent } from '../complex-field.component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent extends ComplexFieldComponent {
  @Input() placeholder = '';
  @Input() autosize: boolean;
  @Input() maxHeight = '400px';
  @Input() minHeight = '200px';

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
}
