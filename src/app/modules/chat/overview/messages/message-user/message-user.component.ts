import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingUserDto } from '../../../../meeting/meeting';
import { ChatMessageDto } from '../../../chat';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../../../core/i18n/translate';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../../../core/toast/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MeetingService } from '../../../../meeting/meeting.service';
import { ChatService } from '../../../chat.service';
import { ChatStoreService } from '../../../chat-store.service';

@Component({
  selector: 'app-message-user',
  templateUrl: './message-user.component.html',
  styleUrls: ['./message-user.component.scss'],
})
export class MessageUserComponent {
  @Input() user: MeetingUserDto;
  @Input() message: ChatMessageDto;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() dateToShow: string;
  @Output() showDate = new EventEmitter<string>();

  constructor(
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly chatStore: ChatStoreService,
  ) {}

  get isDateShown(): boolean {
    return this.message.date === this.dateToShow;
  }

  toggleDate() {
    this.showDate.emit(this.message.date);
  }

  sendAgain() {
    this.chatStore.markAsSending(this.message);

    this.chatService.sendMessage(this.message).subscribe(
      () => {
        this.chatStore.markAsSent(this.message);
        this.storage.set('lastMessageDate', this.message.date);
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
          this.chatStore.markAsFailed(this.message);
        }
      },
    );
  }
}
