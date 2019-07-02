import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ChatMessageDto } from '../../chat';
import { MeetingDto, MeetingUserDto } from '../../../meeting/meeting';
import { UserDto } from '../../../user/user';
import { _ } from '../../../../core/i18n/translate';
import { ChatStoreService } from '../../chat-store.service';
import { ChatService } from '../../chat.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../../../../core/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MeetingService } from '../../../meeting/meeting.service';
import { Modal } from '../../../../shared/modal/modal';
import { ModalService } from '../../../../shared/modal/modal.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  @Input() messages: ChatMessageDto[];
  @Input() meeting: MeetingDto;
  @Input() user: UserDto;
  dateToShow: string;
  isLoading: boolean;
  hasMoreMessages: boolean;
  @ViewChild('actions') modalTemplate: TemplateRef<any>;
  modal: Modal;
  modalMessage: ChatMessageDto;

  constructor(
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly chatStore: ChatStoreService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    if (this.chatStore.data.messages.length === 20) {
      this.hasMoreMessages = true;
    }

    setTimeout(() => {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }, 240);
  }

  findUser(userId: number): MeetingUserDto {
    return this.meeting.users.find(user => user.id === userId);
  }

  showDate(date) {
    if (this.dateToShow === date) {
      this.dateToShow = null; // toggle if same date passed
    } else {
      this.dateToShow = date;
    }
  }

  loadMessages() {
    if (this.hasMoreMessages && !this.isLoading) {
      this.isLoading = true;
      const firstMessage = this.chatStore.data.messages[0];

      this.chatService.findMessages(firstMessage.date).subscribe(
        (messages: ChatMessageDto[]) => {
          const mergedMessages = [...messages, ...this.chatStore.data.messages];
          this.chatStore.setMessages(mergedMessages);

          if (mergedMessages.length > 0) {
            this.storage.set(
              'lastMessageDate',
              mergedMessages[mergedMessages.length - 1].date,
            );
          }

          if (messages.length < 20) {
            this.hasMoreMessages = false;
          }

          this.isLoading = false;
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while loading messages'),
          );

          this.isLoading = false;
        },
      );
    }
  }

  showActions(message: ChatMessageDto) {
    this.modalMessage = message;

    this.modal = this.modalService.show(this.modalTemplate);
  }

  sendAgain(oldMessage: ChatMessageDto) {
    const newMessage: ChatMessageDto = {
      date: new Date().toISOString(),
      message: oldMessage.message,
      userId: oldMessage.userId,
      sending: true,
    };

    this.chatStore.removeOldAndAddNew(oldMessage, newMessage);
    this.modal.hide();

    this.chatService.sendMessage(newMessage).subscribe(
      () => {
        this.chatStore.markAsSent(newMessage);
        this.storage.set('lastMessageDate', newMessage.date);
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
          this.chatStore.markAsFailed(newMessage);
        }
      },
    );
  }

  remove(message: ChatMessageDto) {
    this.chatStore.removeMessage(message);
    this.modal.hide();
  }

  decline() {
    this.modal.hide();
  }
}
