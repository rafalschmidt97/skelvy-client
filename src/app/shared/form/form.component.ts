import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form } from './form';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements Form {
  @Input() form: FormGroup;
  @Input() isLoading: boolean;

  @Output() onSubmit = new EventEmitter();
}
