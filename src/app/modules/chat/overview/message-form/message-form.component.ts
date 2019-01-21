import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../../chat';
import { Form, OnSubmit } from '../../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/form/input/input.component';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;

  @Output() sendMessage = new EventEmitter<Message>();

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      message: [
        '',
        [Validators.required, InputComponent.noWhitespaceValidation()],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;

      this.sendMessage.emit({
        date: new Date(),
        text: this.form.get('message').value.trim(),
        userId: 1,
      });

      this.form.patchValue({
        message: '',
      });

      this.isLoading = false;
    }
  }
}
