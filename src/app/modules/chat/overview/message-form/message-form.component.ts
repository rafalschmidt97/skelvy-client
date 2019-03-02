import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Message } from '../../chat';
import { Form, OnSubmit } from '../../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/form/input/input.component';
import { UserStoreService } from '../../../profile/user-store.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;

  @Output() sendMessage = new EventEmitter<Message>();
  @ViewChild('messageInput') messageInput: ElementRef;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userStore: UserStoreService,
  ) {
    this.form = this.formBuilder.group({
      message: [
        '',
        [Validators.required, InputComponent.noWhitespaceValidation()],
      ],
    });
  }

  onSubmit() {
    this.messageInput.nativeElement.focus();

    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;

      this.sendMessage.emit({
        date: new Date(),
        message: this.form.get('message').value.trim(),
        userId: this.userStore.data.id,
      });

      this.form.patchValue({
        message: '',
      });

      this.isLoading = false;
    }
  }
}
