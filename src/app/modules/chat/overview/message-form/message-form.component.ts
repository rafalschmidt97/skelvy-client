import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Form, OnSubmit } from '../../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/form/input/input.component';
import { UserStoreService } from '../../../user/user-store.service';
import { Connection } from '../../../user/user';
import { ChatMessageDto } from '../../chat';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;

  @Output() sendMessage = new EventEmitter<ChatMessageDto>();
  @ViewChild('messageInput') messageInput: ElementRef;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userStore: UserStoreService,
  ) {
    this.form = this.formBuilder.group({
      message: [
        '',
        [
          Validators.required,
          InputComponent.noWhitespaceValidation(),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  onSubmit() {
    this.messageInput.nativeElement.focus();

    if (
      this.form.valid &&
      !this.isLoading &&
      this.userStore.data.connection === Connection.CONNECTED
    ) {
      this.isLoading = true;

      this.sendMessage.emit({
        userId: this.userStore.data.id,
        date: new Date(),
        message: this.form.get('message').value.trim(),
      });

      this.form.patchValue({
        message: '',
      });

      this.isLoading = false;
    }
  }

  get hasErrorMaxLength(): boolean {
    return this.form.get('message').hasError('maxlength');
  }

  get hasErrorRequired(): boolean {
    return this.form.get('message').hasError('required');
  }
}
