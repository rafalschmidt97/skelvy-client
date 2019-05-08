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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Connection } from '../../../user/user';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;
  connected$: Observable<boolean>;

  @Output() sendMessage = new EventEmitter();
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

    this.connected$ = userStore.data$.pipe(
      map(x => x.connection === Connection.CONNECTED),
    );
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
