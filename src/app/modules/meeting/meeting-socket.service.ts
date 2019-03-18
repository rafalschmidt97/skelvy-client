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
    private readonly storage: Storage,
  ) {}

  set socket(socket: HubConnection) {
    this.userSocket = socket;
  }

  onMeetingActions() {
    this.onReceiveMessage();
    this.onReceiveMessages();
    this.onUserAddedToMeeting();
    this.onUserLeftMeeting();
    this.onMeetingFound();
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

  loadMessages(fromDate: Date, toDate: Date) {
    this.userSocket
      .invoke('LoadMessages', {
        fromDate: moment(fromDate).format(),
        toDate: moment(toDate).format(),
      })
      .catch(() => {
        this.toastService.createError(
          _('A problem occurred while loading messages'),
        );
      });
  }

  private onReceiveMessage() {
    this.userSocket.on('ReceiveMessage', (message: ChatMessage) => {
      this.chatStore.addMessage(message);

      if (this.router.url !== '/app/chat') {
        this.chatStore.addToRead(1);
      } else {
        this.storage.set('lastMessageDate', message.date);
      }
    });
  }

  private onReceiveMessages() {
    this.userSocket.on('ReceiveMessages', (messages: ChatMessage[]) => {
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
    });
  }

  private onUserAddedToMeeting() {
    this.userSocket.on('UserAddedToMeeting', () => {
      this.meetingService.findMeeting().subscribe(
        () => {
          this.toastService.createInformation(
            _('The new user has been added to the group'),
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

  private onMeetingFound() {
    this.userSocket.on('MeetingFound', () => {
      this.meetingService.findMeeting().subscribe(
        () => {
          this.toastService.createInformation(
            _('The new meeting has been found'),
          );
          this.addToGroup();
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
      const oldMeetingId = this.meetingStore.data.meeting.id;
      this.meetingService.findMeeting().subscribe(
        model => {
          if (model.meeting) {
            this.toastService.createInformation(
              _('The user has left the group'),
            );
          } else {
            this.toastService.createInformation(_('All users left the group'));
            this.removeFromGroup(oldMeetingId);
            this.clearChatStore();
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

  public getLatestMessages() {
    this.userSocket
      .invoke('LoadMessages', {
        fromDate: moment()
          .add(-1, 'days')
          .format(),
        toDate: moment().format(),
      })
      .catch(() => {
        this.toastService.createError(
          _('A problem occurred while loading messages'),
        );
      });
  }

  public addToGroup() {
    this.userSocket.invoke('AddToMeeting').catch(() => {
      this.toastService.createError(
        _('A problem occurred while adding to the group'),
      );
    });
  }

  public removeFromGroup(meetingId: number) {
    this.userSocket.invoke('RemoveFromMeeting', meetingId).catch(() => {
      this.toastService.createError(
        _('A problem occurred while removing from the group'),
      );
    });
  }

  public initializeChatStore() {
    this.chatStore.set({
      messagesToRead: 0,
      messages: [],
    });
  }

  private clearChatStore() {
    this.chatStore.set(null);
  }
}
