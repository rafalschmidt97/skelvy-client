import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ChatMessageDto,
  ChatMessageState,
  MeetingDto,
} from '../../../meeting/meeting';
import { UserDto } from '../../../user/user';
import { _ } from '../../../../core/i18n/translate';
import { ChatService } from '../../chat.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../../../../core/toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MeetingService } from '../../../meeting/meeting.service';
import { Modal } from '../../../../shared/modal/modal';
import { ModalService } from '../../../../shared/modal/modal.service';
import { storageKeys } from '../../../../core/storage/storage';
import { Store } from '@ngxs/store';
import {
  AddChatMessages,
  MarkChatMessageAsFailed,
  MarkChatMessageAsSent,
  RemoveChatMessage,
  RemoveOldAndAddNewChatMessage,
} from '../../../meeting/store/meeting-actions';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  @ViewChild('actions') modalTemplate: TemplateRef<any>;
  @Input() messages: ChatMessageState[];
  @Input() meeting: MeetingDto;
  @Input() user: UserDto;
  dateToShow: string;
  isLoading = false;
  hasMoreMessages = false;
  modal: Modal;
  modalMessage: ChatMessageState;

  constructor(
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly modalService: ModalService,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    if (
      this.store.selectSnapshot(state => state.meeting.meetingModel.messages)
        .length === 20
    ) {
      this.hasMoreMessages = true;
    }

    this.scrollToLastMessage();
  }

  findUser(userId: number): UserDto {
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
      const firstMessage = this.store.selectSnapshot(
        state => state.meeting.meetingModel.messages,
      )[0];

      this.chatService.findMessages(firstMessage.date).subscribe(
        (messages: ChatMessageDto[]) => {
          this.store.dispatch(new AddChatMessages(messages, false));

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

  showActions(message: ChatMessageState) {
    this.modalMessage = message;
    this.modal = this.modalService.show(this.modalTemplate);
  }

  sendAgain(oldMessage: ChatMessageState) {
    const newMessage: ChatMessageState = {
      id: 0,
      date: new Date().toISOString(),
      message: oldMessage.message,
      userId: oldMessage.userId,
      sending: true,
    };

    this.store.dispatch(
      new RemoveOldAndAddNewChatMessage(oldMessage, newMessage),
    );
    this.modal.hide();

    this.chatService.sendMessage(newMessage).subscribe(
      () => {
        this.store.dispatch(new MarkChatMessageAsSent(newMessage));
        this.storage.set(storageKeys.lastMessageDate, newMessage.date);
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
          this.store.dispatch(new MarkChatMessageAsFailed(newMessage));
        }
      },
    );
  }

  remove(message: ChatMessageState) {
    this.store.dispatch(new RemoveChatMessage(message));
    this.modal.hide();
  }

  decline() {
    this.modal.hide();
  }

  private scrollToLastMessage() {
    setTimeout(() => {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }, 240);
  }
}
