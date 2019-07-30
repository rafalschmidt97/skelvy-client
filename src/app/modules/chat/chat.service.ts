import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageDto, MessageState } from '../meeting/meeting';
import { catchError, tap } from 'rxjs/operators';
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

  findMessages(groupId: number, beforeDate: string): Observable<MessageDto[]> {
    return this.http
      .get<MessageDto[]>(
        `${
          environment.versionApiUrl
        }messages/self?groupId=${groupId}&beforeDate=${new Date(
          beforeDate,
        ).toISOString()}`,
      )
      .pipe(
        tap(messages => {
          this.store.dispatch(new AddChatMessages(messages, false));
        }),
      );
  }

  findMoreMessages(): Observable<MessageDto[]> {
    const firstMessage = this.store.selectSnapshot(
      state => state.meeting.meetingModel.messages,
    )[0];
    return this.findMessages(firstMessage.groupId, firstMessage.date).pipe(
      tap(messages => {
        this.store.dispatch(new AddChatMessages(messages, false));
      }),
    );
  }

  sendMessage(message: MessageState): Observable<MessageDto> {
    return this.http
      .post<MessageDto>(environment.versionApiUrl + 'messages/self', message)
      .pipe(
        tap(async apiMessage => {
          this.store.dispatch(new MarkChatMessageAsSent(message, apiMessage));
          await this.storage.set(storageKeys.lastMessageDate, apiMessage.date);
        }),
        catchError(error => {
          this.store.dispatch(new MarkChatMessageAsFailed(message));
          return throwError(error);
        }),
      );
  }

  sendAgainMessage(oldMessage: MessageState): Observable<MessageDto> {
    const newMessage: MessageState = {
      text: oldMessage.text,
      attachmentUrl: oldMessage.attachmentUrl,
      date: new Date().toISOString(),
      userId: oldMessage.userId,
      groupId: oldMessage.groupId,
      sending: true,
    };

    this.store.dispatch(
      new RemoveOldAndAddNewChatMessage(oldMessage, newMessage),
    );

    return this.sendMessage(newMessage);
  }

  async addMessage(message: MessageState) {
    this.store.dispatch(new AddChatMessage(message));

    if (this.router.url !== '/app/chat') {
      this.store.dispatch(new AddChatMessagesToRead(1));
    } else {
      await this.storage.set(storageKeys.lastMessageDate, message.date);
    }
  }

  removeMessage(message: MessageState) {
    this.store.dispatch(new RemoveChatMessage(message));
  }
}
