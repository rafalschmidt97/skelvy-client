import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  MessageActionType,
  MessageDto,
  MessageState,
  MessageType,
} from '../meeting/meeting';
import { catchError, tap } from 'rxjs/operators';
import {
  AddGroupMessage,
  AddGroupMessages,
  MarkResponseGroupMessageAsFailed,
  MarkResponseGroupMessageAsSent,
  RemoveOldAndAddNewResponseGroupMessage,
  RemoveResponseGroupMessage,
} from '../meeting/store/meeting-actions';
import { Store } from '@ngxs/store';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { BackgroundService } from '../../core/background/background.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
    private readonly storage: Storage,
    private readonly router: Router,
    private readonly backgroundService: BackgroundService,
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
          this.store.dispatch(
            new AddGroupMessages(messages[0].groupId, messages, false),
          );
        }),
      );
  }

  findMoreMessages(): Observable<MessageDto[]> {
    const firstMessage = this.store.selectSnapshot(
      state => state.meeting.meetingModel.messages,
    )[0];
    return this.findMessages(firstMessage.groupId, firstMessage.date).pipe(
      tap(messages => {
        this.store.dispatch(
          new AddGroupMessages(messages[0].groupId, messages, false),
        );
      }),
    );
  }

  sendMessage(message: MessageState): Observable<MessageDto[]> {
    return this.http
      .post<MessageDto[]>(environment.versionApiUrl + 'messages/self', message)
      .pipe(
        tap(async apiMessages => {
          this.store.dispatch(
            new MarkResponseGroupMessageAsSent(
              message.groupId,
              message,
              apiMessages,
            ),
          );
          // TODO: set not red messages
        }),
        catchError(error => {
          this.store.dispatch(
            new MarkResponseGroupMessageAsFailed(message.groupId, message),
          );
          return throwError(error);
        }),
      );
  }

  sendAgainMessage(oldMessage: MessageState): Observable<MessageDto[]> {
    const newMessage: MessageState = {
      id: 0,
      type: MessageType.RESPONSE,
      text: oldMessage.text,
      attachmentUrl: oldMessage.attachmentUrl,
      date: new Date().toISOString(),
      action: null,
      userId: oldMessage.userId,
      groupId: oldMessage.groupId,
      sending: true,
    };

    this.store.dispatch(
      new RemoveOldAndAddNewResponseGroupMessage(
        oldMessage.groupId,
        oldMessage,
        newMessage,
      ),
    );

    return this.sendMessage(newMessage);
  }

  async addMessage(message: MessageState) {
    this.store.dispatch(new AddGroupMessage(message.groupId, message));
    // TODO: set not red messages
  }

  async addSentMessagesWithReading(messages: MessageState[], userId: number) {
    this.store.dispatch(new AddGroupMessages(messages[0].groupId, messages));

    if (
      this.router.url !== '/app/chat' ||
      this.backgroundService.inBackground
    ) {
      // TODO: set not red messages
    } else {
      const responseMessages = messages.filter(
        x => x.type === MessageType.RESPONSE,
      );

      if (responseMessages.length > 0) {
        await this.readMessage(
          userId,
          responseMessages[responseMessages.length - 1].groupId,
        ).toPromise();
      }
    }
  }

  async readMessages(groupId: number, messages: (MessageState | MessageDto)[]) {
    // TODO: get not red messages
    // const lastNonSeenMessageDateState = [...messages]
    //   .reverse()
    //   .find((x: MessageState) => !isSeenMessage(x)).date;
    //
    // if (
    //   lastNonSeenMessageDateState &&
    //   new Date(lastMessageDate).getTime() <
    //     new Date(lastNonSeenMessageDateState).getTime()
    // ) {
    //   this.readMessage(
    //     this.store.selectSnapshot(state => state.user.user.id),
    //     groupId,
    //   ).subscribe();
    // }
  }

  async readMessagesFromState(groupId: number) {
    const messages = this.store.selectSnapshot(
      state => state.meeting.meetingModel.messages,
    );

    if (messages.length > 0) {
      await this.readMessages(groupId, messages);
    }
  }

  removeMessage(message: MessageState) {
    this.store.dispatch(
      new RemoveResponseGroupMessage(message.groupId, message),
    );
  }

  readMessage(userId: number, groupId: number): Observable<MessageDto[]> {
    const message: MessageState = {
      id: 0,
      type: MessageType.ACTION,
      text: null,
      attachmentUrl: null,
      date: new Date().toISOString(),
      action: MessageActionType.SEEN,
      userId: userId,
      groupId: groupId,
    };

    return this.http
      .post<MessageDto[]>(environment.versionApiUrl + 'messages/self', message)
      .pipe(
        tap(async ([seenMessage]) => {
          this.store.dispatch(
            new AddGroupMessage(seenMessage.groupId, seenMessage),
          );
          // TODO: set not red messages
        }),
      );
  }

  sendAction(
    userId: number,
    groupId: number,
    action: MessageActionType,
  ): Observable<MessageDto[]> {
    const message: MessageState = {
      id: 0,
      type: MessageType.ACTION,
      text: null,
      attachmentUrl: null,
      date: new Date().toISOString(),
      action: action,
      userId: userId,
      groupId: groupId,
    };

    return this.http.post<MessageDto[]>(
      environment.versionApiUrl + 'messages/self',
      message,
    );
  }
}
