import { Injectable } from '@angular/core';
import { ChatMessage } from '../chat/chat';
import { _ } from '../../core/i18n/translate';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { ChatStoreService } from '../chat/chat-store.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { MeetingStoreService } from './meeting-store.service';
import { MeetingService } from './meeting.service';
import { HubConnection } from '@aspnet/signalr';
import { ChatService } from '../chat/chat.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingSocketService {
  private userSocket: HubConnection;

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly chatStore: ChatStoreService,
    private readonly meetingStore: MeetingStoreService,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly storage: Storage,
  ) {}

  set socket(socket: HubConnection) {
    this.userSocket = socket;
  }

  onMeetingActions() {
    this.onUserSentMeetingChatMessage();
    this.onUserJoinedMeeting();
    this.onUserFoundMeeting();
    this.onUserLeftMeeting();
    this.onMeetingRequestExpired();
    this.onMeetingExpired();
  }

  initialize() {
    if (this.meetingStore.data && this.meetingStore.data.meeting) {
      this.initializeChatStore();
      this.getLatestMessages();
    }
  }

  sendMessage(message: any) {
    this.userSocket.invoke('SendMessage', message).catch(() => {
      this.toastService.createError(
        _('A problem occurred while sending the message'),
      );
    });
  }

  loadMessages(fromDate, toDate) {
    this.chatService.findMessages(fromDate, toDate).subscribe(
      (messages: ChatMessage[]) => {
        const mergedMessages = messages.concat(this.chatStore.data.messages);
        mergedMessages.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        this.chatStore.setMessages(mergedMessages);

        if (this.router.url !== '/app/chat') {
          this.storage.get('lastMessageDate').then((date: Date) => {
            const notRedMessages = mergedMessages.filter(message => {
              return new Date(message.date) > new Date(date);
            });
            this.chatStore.setToRead(notRedMessages.length);
          });
        } else {
          if (mergedMessages.length > 0) {
            this.storage.set(
              'lastMessageDate',
              mergedMessages[mergedMessages.length - 1].date,
            );
          }
        }
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while loading messages'),
        );
      },
    );
  }

  getLatestMessages() {
    this.loadMessages(
      moment()
        .add(-1, 'days')
        .toDate()
        .toUTCString(),
      moment()
        .toDate()
        .toUTCString(),
    );
  }

  initializeChatStore() {
    this.chatStore.set({
      messagesToRead: 0,
      messages: [],
    });
  }

  private onUserSentMeetingChatMessage() {
    this.userSocket.on('UserSentMeetingChatMessage', (message: ChatMessage) => {
      this.chatStore.addMessage(message);

      if (this.router.url !== '/app/chat') {
        this.chatStore.addToRead(1);
      } else {
        this.storage.set('lastMessageDate', message.date);
      }
    });
  }

  private onUserJoinedMeeting() {
    this.userSocket.on('UserJoinedMeeting', () => {
      this.meetingService.findMeeting().subscribe(
        () => {
          this.toastService.createInformation(
            _('A new user has been added to the group'),
          );
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while finding the meeting'),
          );
        },
      );
    });
  }

  private onUserFoundMeeting() {
    this.userSocket.on('UserFoundMeeting', () => {
      this.meetingService.findMeeting().subscribe(
        () => {
          this.toastService.createInformation(
            _('A new meeting has been found'),
          );
          this.initializeChatStore();
          this.getLatestMessages();
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while finding the meeting'),
          );
        },
      );
    });
  }

  private onUserLeftMeeting() {
    this.userSocket.on('UserLeftMeeting', () => {
      this.meetingService.findMeeting().subscribe(
        model => {
          if (model.meeting) {
            this.toastService.createInformation(_('A user has left the group'));
          } else {
            this.toastService.createInformation(_('All users left the group'));
            this.clearMeetingWithChat();
          }
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while finding the meeting'),
          );
        },
      );
    });
  }

  private onMeetingRequestExpired() {
    this.userSocket.on('MeetingRequestExpired', () => {
      this.toastService.createInformation(_('A meeting request has expired'));
      this.clearMeetingWithChat();
    });
  }

  private onMeetingExpired() {
    this.userSocket.on('MeetingExpired', () => {
      this.toastService.createInformation(_('A meeting has expired'));
      this.clearMeetingWithChat();
    });
  }

  private clearMeetingWithChat() {
    this.meetingStore.set(null);
    this.chatStore.set(null);
    this.storage.remove('lastMessageDate');
  }
}
