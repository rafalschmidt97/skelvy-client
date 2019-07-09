import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import {
  ChatMessageState,
  MeetingDrinkTypeDto,
  MeetingModel,
  MeetingRequestRequest,
  MeetingStatus,
  MeetingSuggestionsModel,
} from './meeting';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { storageKeys } from '../../core/storage/storage';
import { UserDto } from '../user/user';
import { Store } from '@ngxs/store';
import {
  AddMeetingUser,
  ChangeMeetingLoadingStatus,
  RemoveMeetingUser,
  UpdateChatMessagesToRead,
  UpdateMeeting,
} from './store/meeting-actions';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  findMeeting(
    markedAsLoading: boolean = false,
    mergeExisting: boolean = true,
  ): Observable<MeetingModel> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<MeetingModel>(
        `${environment.versionApiUrl}meetings/self?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(async model => {
          if (this.isSameMeeting(model)) {
            if (mergeExisting) {
              this.store.dispatch(new ChangeMeetingLoadingStatus(false));
              this.initializeMeetingModel(
                model,
                await this.initializeChatWithExistingChatMessages(model),
              );
            } else {
              this.store.dispatch(new ChangeMeetingLoadingStatus(false));
              this.initializeMeetingModel(
                model,
                await this.initializeFreshChat(model),
              );
            }
          } else {
            if (model.status === MeetingStatus.FOUND) {
              this.store.dispatch(new ChangeMeetingLoadingStatus(false));
              this.initializeMeetingModel(
                model,
                await this.initializeFreshChat(model),
              );
            } else {
              this.store.dispatch(new ChangeMeetingLoadingStatus(false));
              this.initializeMeetingModel(model, null);
            }
          }
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));

          if (error instanceof HttpErrorResponse && error.status === 404) {
            this.clearMeeting();
          }

          return throwError(error);
        }),
      );
  }

  leaveMeeting(): Observable<void> {
    return this.http
      .delete<void>(environment.versionApiUrl + 'meetings/self')
      .pipe(
        tap(() => {
          this.store.dispatch(new UpdateMeeting(null));
          this.storage.remove(storageKeys.lastMessageDate);
        }),
      );
  }

  createMeetingRequest(request: MeetingRequestRequest): Observable<void> {
    return this.http.post<void>(
      environment.versionApiUrl + 'users/self/request',
      request,
    );
  }

  removeMeetingRequest(): Observable<void> {
    return this.http
      .delete<void>(environment.versionApiUrl + 'users/self/request')
      .pipe(
        tap(() => {
          this.store.dispatch(new UpdateMeeting(null));
        }),
      );
  }

  findDrinks(): Observable<MeetingDrinkTypeDto[]> {
    return this.http.get<MeetingDrinkTypeDto[]>(
      environment.versionApiUrl + 'drinks/types',
    );
  }

  findMeetingSuggestions(
    latitude: number,
    longitude: number,
  ): Observable<MeetingSuggestionsModel> {
    return this.http.get<MeetingSuggestionsModel>(
      `${environment.versionApiUrl}users/self/meeting-suggestions` +
        `?latitude=${latitude}&longitude=${longitude}&language=${this.translateService.currentLang}`,
    );
  }

  joinMeeting(meetingId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.versionApiUrl}users/self/join-meeting/${meetingId}`,
      null,
    );
  }

  connectMeetingRequest(requestId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.versionApiUrl}users/self/connect-request/${requestId}`,
      null,
    );
  }

  findUser(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(
      `${environment.versionApiUrl}users/${userId}`,
    );
  }

  addUser(userId: number): Observable<UserDto> {
    return this.findUser(userId).pipe(
      tap(user => {
        this.store.dispatch(new AddMeetingUser(user));
      }),
    );
  }

  removeUser(userId: number) {
    this.store.dispatch(new RemoveMeetingUser(userId));
  }

  clearMeeting() {
    this.store.dispatch(new UpdateMeeting(null));
    this.store.dispatch(new UpdateChatMessagesToRead(0));
  }

  private isSameMeeting(model): boolean {
    const storedModel = this.store.selectSnapshot(x => x.meeting.meetingModel);
    return (
      storedModel &&
      model.status === MeetingStatus.FOUND &&
      storedModel.status === MeetingStatus.FOUND &&
      model.meeting.id === storedModel.meeting.id
    );
  }

  private async initializeChatWithExistingChatMessages(
    model: MeetingModel,
  ): Promise<ChatMessageState[]> {
    const existingMessages = this.store.selectSnapshot(
      x => x.meeting.meetingModel.messages,
    );
    const newMessages = model.messages.filter(message1 => {
      return (
        existingMessages.filter(message2 => {
          return (
            new Date(message1.date).getTime() ===
              new Date(message2.date).getTime() &&
            message1.userId === message2.userId &&
            message1.message === message2.message
          );
        }).length === 0
      );
    });

    if (newMessages.length !== 20) {
      const messages = [...existingMessages, ...newMessages];

      if (this.router.url !== '/app/chat') {
        const lastMessageDate = await this.storage.get(
          storageKeys.lastMessageDate,
        );
        const notRedMessages = messages.filter(message => {
          return new Date(message.date) > new Date(lastMessageDate);
        });

        this.store.dispatch(
          new UpdateChatMessagesToRead(notRedMessages.length),
        );
      } else {
        await this.storage.set(
          storageKeys.lastMessageDate,
          messages[messages.length - 1].date,
        );
      }

      return messages;
    } else {
      if (this.router.url !== '/app/chat') {
        this.store.dispatch(new UpdateChatMessagesToRead(newMessages.length));
      } else {
        if (newMessages.length > 0) {
          await this.storage.set(
            storageKeys.lastMessageDate,
            newMessages[newMessages.length - 1].date,
          );
        }
        return newMessages;
      }
    }
  }

  private async initializeFreshChat(
    model: MeetingModel,
  ): Promise<ChatMessageState[]> {
    await this.storage.remove(storageKeys.lastMessageDate);

    if (this.router.url !== '/app/chat') {
      this.store.dispatch(new UpdateChatMessagesToRead(model.messages.length));
    } else {
      if (model.messages.length > 0) {
        await this.storage.set(
          storageKeys.lastMessageDate,
          model.messages[model.messages.length - 1].date,
        );
      }
    }

    return <ChatMessageState[]>model.messages;
  }

  private initializeMeetingModel(
    model: MeetingModel,
    messages: ChatMessageState[],
  ) {
    this.store.dispatch(
      new UpdateMeeting({
        status: model.status,
        meeting: model.meeting,
        request: model.request,
        messages,
      }),
    );
  }
}
