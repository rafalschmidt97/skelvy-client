import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ChatMessage } from '../../chat';
import { Meeting, MeetingUser } from '../../../meeting/meeting';
import { User } from '../../../profile/user';
import { _ } from '../../../../core/i18n/translate';
import { ChatStoreService } from '../../chat-store.service';
import { ChatService } from '../../chat.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../../../../core/toast/toast.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('actions') actions: TemplateRef<any>;
  @Input() messages: ChatMessage[];
  @Input() meeting: Meeting;
  @Input() user: User;
  dateToShow: Date;
  isLoading: boolean;
  hasMoreMessages: boolean;

  constructor(
    private readonly chatStore: ChatStoreService,
    private readonly chatService: ChatService,
    private readonly storage: Storage,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit() {
    if (this.chatStore.data.messages.length === 20) {
      this.hasMoreMessages = true;
    }
  }

  findUser(userId: number): MeetingUser {
    return this.meeting.users.find(user => user.id === userId);
  }

  showDate(date: Date) {
    if (this.dateToShow === date) {
      this.dateToShow = null; // toggle if same date passed
    } else {
      this.dateToShow = date;
    }
  }

  loadMessages() {
    this.isLoading = true;
    const nextPage = this.chatStore.data.page + 1;
    this.chatStore.setPage(nextPage);

    this.chatService.findMessages(nextPage).subscribe(
      (messages: ChatMessage[]) => {
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
