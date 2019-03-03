import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { MeetingStoreService } from './meeting-store.service';
import { MeetingDrink, MeetingModel, MeetingRequest } from './meeting';
import { ChatService } from '../chat/chat.service';
import { ChatMessage } from '../chat/chat';
import { _ } from '../../core/i18n/translate';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { ChatStoreService } from '../chat/chat-store.service';

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
      if (
        this.router.url === '/app/tabs/meeting' ||
        this.router.url === '/app/chat'
      ) {
        const messagesToSet = [...this.chatStore.data.messages, message];
        this.chatStore.set({
          messagesSeen: messagesToSet.length,
          messages: messagesToSet,
        });
      } else {
        this.chatStore.addMessage(message);
      }

      // TODO: show native notification
    });

    this.hub.onclose(() => {
      this.toastService.createWarning(_('Connection lost'));
    });

    this.hub
      .start()
      .then(() => {
        // TODO: get latest messages and according to them set what user seen
        this.chatStore.set({
          messagesSeen: 0,
          messages: [],
        });
      })
      .catch(() => {
        this.toastService.createError(_('Something went wrong'));
      });
  }
}
