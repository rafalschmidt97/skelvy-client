import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  ChatMessageDto,
  ChatMessageRequest,
  ChatMessageState,
} from '../meeting/meeting';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  AddChatMessage,
  AddChatMessages,
  AddChatMessagesToRead,
  MarkChatMessageAsFailed,
  MarkChatMessageAsSent,
  RemoveChatMessage,
  RemoveOldAndAddNewChatMessage,
} from '../meeting/store/meeting-actions';
import { Store } from '@ngxs/store';
import { storageKeys } from '../../core/storage/storage';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
    private readonly storage: Storage,
    private readonly router: Router,
  ) {}

  findMessages(beforeDate: string): Observable<ChatMessageDto[]> {
    return this.http
      .get<ChatMessageDto[]>(
        `${environment.versionApiUrl}meetings/self/chat?beforeDate=${new Date(
          beforeDate,
        ).toISOString()}`,
      )
      .pipe(
        tap(messages => {
          this.store.dispatch(new AddChatMessages(messages, false));
        }),
      );
  }

  findMoreMessages(): Observable<ChatMessageDto[]> {
    const firstMessage = this.store.selectSnapshot(
      state => state.meeting.meetingModel.messages,
    )[0];
    return this.findMessages(firstMessage.date).pipe(
      tap(messages => {
        this.store.dispatch(new AddChatMessages(messages, false));
      }),
    );
  }

  sendMessage(message: ChatMessageRequest): Observable<void> {
    return this.http
      .post<void>(environment.versionApiUrl + 'meetings/self/chat', message)
      .pipe(
        tap(async () => {
          this.store.dispatch(new MarkChatMessageAsSent(message));
          await this.storage.set(storageKeys.lastMessageDate, message.date);
        }),
        catchError(error => {
          if (error.status !== 404 && error.status === 409) {
            this.store.dispatch(new MarkChatMessageAsFailed(message));
          }
          return throwError(error);
        }),
      );
  }

  sendAgainMessage(oldMessage: ChatMessageRequest): Observable<void> {
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

    return this.sendMessage(newMessage);
  }

  async addMessage(message: ChatMessageState) {
    this.store.dispatch(new AddChatMessage(message));

    if (this.router.url !== '/app/chat') {
      this.store.dispatch(new AddChatMessagesToRead(1));
    } else {
      await this.storage.set(storageKeys.lastMessageDate, message.date);
    }
  }

  addAndSendMessage(message: ChatMessageState): Observable<void> {
    return from(this.addMessage(message)).pipe(
      switchMap(() => {
        return this.sendMessage(message);
      }),
    );
  }

  removeMessage(message: ChatMessageState) {
    this.store.dispatch(new RemoveChatMessage(message));
  }
}
