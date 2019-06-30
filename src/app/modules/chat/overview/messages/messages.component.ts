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

    setTimeout(() => {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }, 100);
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
    this.isLoading = true;
    const nextPage = this.chatStore.data.page + 1;
    this.chatStore.setPage(nextPage);

    this.chatService.findMessages(nextPage).subscribe(
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
