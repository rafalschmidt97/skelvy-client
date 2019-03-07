import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../chat/chat';
import { _ } from '../../core/i18n/translate';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@aspnet/signalr';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { ChatStoreService } from '../chat/chat-store.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { MeetingStoreService } from './meeting-store.service';
import { MeetingService } from './meeting.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingHubService {
  public readonly hub: HubConnection;
  private initialized: boolean;

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly chatStore: ChatStoreService,
    private readonly meetingStore: MeetingStoreService,
    private readonly meetingService: MeetingService,
    private readonly storage: Storage,
  ) {
    this.hub = new HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'meeting', {
        accessTokenFactory: () => {
          return this.sessionService.getSession();
        },
        logger: LogLevel.Error,
      })
      .build();
  }

  connect() {
    if (!this.initialized) {
      this.onReceiveMessage();
      this.onReceiveMessages();
      this.onUserAddedToMeeting();
      this.onMeetingFound();
      this.onClose();

      this.connectToHub();

      this.initialized = true;
    } else {
      if (this.hub.state === HubConnectionState.Disconnected) {
        this.connectToHub();
      } else {
        this.hub
          .stop()
          .then(() => {
            this.connectToHub();
          })
          .catch(() => {
            this.toastService.createError(_('Something went wrong'));
          });
      }
    }
  }

  disconnect() {
    this.hub.stop().catch(() => {
      this.toastService.createError(_('Something went wrong'));
    });
  }

  private onReceiveMessage() {
    this.hub.on('ReceiveMessage', (message: ChatMessage) => {
      this.chatStore.addMessage(message);

      if (this.router.url !== '/app/chat') {
        this.chatStore.addToRead(1);
      } else {
        this.storage.set('lastMessageDate', message.date);
      }

      // TODO: show native notification
    });
  }

  private onReceiveMessages() {
    this.hub.on('ReceiveMessages', (messages: ChatMessage[]) => {
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
    this.hub.on('UserAddedToMeeting', () => {
      this.meetingService.findMeeting().subscribe(
        () => {},
        () => {
          this.toastService.createError(_('Something went wrong'));
        },
      );
    });
  }

  private onMeetingFound() {
    this.hub.on('MeetingFound', () => {
      this.meetingService.findMeeting().subscribe(
        () => {},
        () => {
          this.toastService.createError(_('Something went wrong'));
        },
      );
    });
  }

  private onClose() {
    this.hub.onclose(() => {
      if (this.meetingStore.data !== null) {
        this.toastService.createError(_('Connection lost'));
      }
    });
  }

  private connectToHub() {
    this.hub
      .start()
      .then(() => {
        if (this.meetingStore.data.meeting) {
          this.initializeChatStore();
          this.getLatestMessages();
        }
      })
      .catch(() => {
        this.toastService.createError(_('Something went wrong'));
      });
  }

  public getLatestMessages() {
    this.hub
      .invoke('LoadMessages', {
        fromDate: moment()
          .add(-1, 'days')
          .toDate(),
        toDate: new Date(),
      })
      .catch(() => {
        this.toastService.createError(_('Error while loading messages'));
      });
  }

  private initializeChatStore() {
    this.chatStore.set({
      messagesToRead: 0,
      messages: [],
    });
  }
}
