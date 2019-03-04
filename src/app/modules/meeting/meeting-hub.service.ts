import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../chat/chat';
import { _ } from '../../core/i18n/translate';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { ChatStoreService } from '../chat/chat-store.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class MeetingHubService {
  public readonly hub: HubConnection;

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly chatStore: ChatStoreService,
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
    this.hub.on('ReceiveMessage', (message: ChatMessage) => {
      this.chatStore.addMessage(message);

      if (this.router.url !== '/app/chat') {
        this.chatStore.addToRead(1);
      } else {
        this.storage.set('lastMessageDate', message.date);
      }

      // TODO: show native notification
    });

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

    this.hub.onclose(() => {
      this.toastService.createWarning(_('Connection lost'));
    });

    this.hub
      .start()
      .then(() => {
        this.chatStore.set({
          messagesToRead: 0,
          messages: [],
        });

        this.getLatestMessages();
      })
      .catch(() => {
        this.toastService.createError(_('Something went wrong'));
      });
  }

  private getLatestMessages() {
    this.hub
      .invoke('LoadMessages', {
        fromDate: moment()
          .add(-7, 'days')
          .toDate(),
        toDate: new Date(),
      })
      .catch(() => {
        this.toastService.createError(_('Error while loading messages'));
      });
  }
}
