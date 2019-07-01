import { Component, ElementRef, ViewChild } from '@angular/core';
import { Form, OnSubmit } from '../../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/form/input/input.component';
import { UserStoreService } from '../../../user/user-store.service';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../../core/i18n/translate';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../../core/toast/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MeetingService } from '../../../meeting/meeting.service';
import { ChatService } from '../../chat.service';
import { ChatStoreService } from '../../chat-store.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;
  @ViewChild('messageInput') messageInput: ElementRef;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userStore: UserStoreService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly chatStore: ChatStoreService,
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

    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;

      this.sendMessage({
        message: this.form.get('message').value.trim(),
        date: moment().format(),
        userId: this.userStore.data.id,
        sending: true,
      });

      this.form.patchValue({
        message: '',
      });

      this.isLoading = false;
    }
  }

  sendMessage(message) {
    this.chatStore.addMessage(message);

    this.chatService.sendMessage(message).subscribe(
      () => {
        this.chatStore.markAsSent(message);
        this.storage.set('lastMessageDate', message.date);
      },
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404 || error.status === 409) {
          this.meetingService.findMeeting().subscribe();

          if (this.router.url === '/app/chat') {
            this.routerNavigation.navigateBack(['/app/tabs/meeting']);
          }

          this.toastService.createError(
            _('A problem occurred while sending the message'),
          );
        } else {
          this.chatStore.markAsFailed(message);
        }
      },
    );
  }

  get hasErrorMaxLength(): boolean {
    return this.form.get('message').hasError('maxlength');
  }

  get hasErrorRequired(): boolean {
    return this.form.get('message').hasError('required');
  }
}
