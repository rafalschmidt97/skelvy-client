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
  @Input() minHeight = '100px';

  get hasErrorMinLength(): boolean {
    return this.form.get(this.name).hasError('minlength');
  }

  get hasErrorMaxLength(): boolean {
    return this.form.get(this.name).hasError('maxlength');
  }
}
