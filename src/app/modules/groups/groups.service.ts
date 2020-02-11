import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  GroupDto,
  GroupRequest,
  MessageActionType,
  MessageDto,
  MessageState,
  MessageType,
} from '../meetings/meetings';
import { catchError, tap } from 'rxjs/operators';
import {
  AddGroup,
  AddGroupMessage,
  AddGroupMessages,
  ChangeMeetingLoadingStatus,
  MarkResponseGroupMessageAsFailed,
  MarkResponseGroupMessageAsSent,
  RemoveGroup,
  RemoveOldAndAddNewResponseGroupMessage,
  RemoveResponseGroupMessage,
  UpdateGroup,
  UpdateGroupFromRequest,
} from '../meetings/store/meetings-actions';
import { Store } from '@ngxs/store';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { BackgroundService } from '../../core/background/background.service';
import { isSeenMessage } from '../meetings/store/meetings-state';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
    private readonly storage: Storage,
    private readonly router: Router,
    private readonly backgroundService: BackgroundService,
  ) {}

  addFoundGroup(
    id: number,
    markedAsLoading: boolean = false,
  ): Observable<GroupDto> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<GroupDto>(`${environment.versionApiUrl}groups/${id}`)
      .pipe(
        tap(group => {
          this.store.dispatch(new AddGroup(group));
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  findMessages(groupId: number, beforeDate: string): Observable<MessageDto[]> {
    return this.http
      .get<MessageDto[]>(
        `${
          environment.versionApiUrl
        }messages?groupId=${groupId}&beforeDate=${new Date(
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

  findMoreMessages(groupId: number): Observable<MessageDto[]> {
    const firstMessage = this.store
      .selectSnapshot(state => state.meetings.groups)
      .find(x => x.id === groupId).messages[0];

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
      .post<MessageDto[]>(environment.versionApiUrl + 'messages', message)
      .pipe(
        tap(async apiMessages => {
          this.store.dispatch(
            new MarkResponseGroupMessageAsSent(
              message.groupId,
              message,
              apiMessages,
            ),
          );
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
  }

  async addMessagesWithReading(groupId: number, messages: MessageState[]) {
    this.store.dispatch(new AddGroupMessages(groupId, messages));

    if (
      this.router.url === `/app/groups/${groupId}/chat` &&
      !this.backgroundService.inBackground
    ) {
      this.readMessagesFromState(groupId);
    }
  }

  async readMessages(groupId: number, messages: (MessageState | MessageDto)[]) {
    const lastNonSeenMessageIndex = [...messages]
      .reverse()
      .findIndex((x: MessageState) => !isSeenMessage(x));

    if (lastNonSeenMessageIndex) {
      const userId = this.store.selectSnapshot(state => state.user.user.id);
      const userSeenMessage = [...messages]
        .reverse()
        .slice(0, lastNonSeenMessageIndex)
        .find(x => x.userId === userId);

      if (!userSeenMessage) {
        this.readMessage(userId, groupId).subscribe();
      }
    }
  }

  async readMessagesFromState(groupId: number) {
    const messages = this.store
      .selectSnapshot(state => state.meetings.groups)
      .find(x => x.id === groupId).messages;

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
      .post<MessageDto[]>(environment.versionApiUrl + 'messages', message)
      .pipe(
        tap(async ([seenMessage]) => {
          this.store.dispatch(
            new AddGroupMessage(seenMessage.groupId, seenMessage),
          );
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
      environment.versionApiUrl + 'messages',
      message,
    );
  }

  clearGroup(groupId: number) {
    this.store.dispatch(new RemoveGroup(groupId));
  }

  leaveGroup(groupId: number): Observable<void> {
    return this.http
      .post<void>(`${environment.versionApiUrl}groups/${groupId}/leave`, null)
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveGroup(groupId));
        }),
      );
  }

  updateGroup(groupId: number, request: GroupRequest): Observable<void> {
    return this.http
      .put<void>(`${environment.versionApiUrl}groups/${groupId}`, request)
      .pipe(
        tap(() => {
          this.store.dispatch(new UpdateGroupFromRequest(groupId, request));
        }),
      );
  }

  syncGroup(
    id: number,
    markedAsLoading: boolean = false,
  ): Observable<GroupDto> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<GroupDto>(`${environment.versionApiUrl}groups/${id}`)
      .pipe(
        tap(group => {
          this.store.dispatch(new UpdateGroup(group));
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          return throwError(error);
        }),
      );
  }
}
