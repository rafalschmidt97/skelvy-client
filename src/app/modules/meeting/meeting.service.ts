import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { MeetingState } from './meeting-state';
import {
  MeetingDrinkTypeDto,
  MeetingModel,
  MeetingRequestRequest,
  MeetingStatus,
  MeetingSuggestionsModel,
  MeetingUserDto,
} from './meeting';
import { ChatState } from '../chat/chat-state';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { GlobalState } from '../../core/state/global-state';
import { Router } from '@angular/router';
import { storageKeys } from '../../core/storage/storage';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private readonly http: HttpClient,
    private readonly meetingState: MeetingState,
    private readonly chatState: ChatState,
    private readonly globalState: GlobalState,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
    private readonly router: Router,
  ) {}

  findMeeting(
    markedAsLoading: boolean = false,
    mergeExisting: boolean = true,
  ): Observable<MeetingModel> {
    if (!markedAsLoading) {
      this.globalState.markMeetingAsLoading();
    }

    return this.http
      .get<MeetingModel>(
        `${environment.versionApiUrl}meetings/self?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(async model => {
          if (this.isSameMeeting(model)) {
            if (mergeExisting) {
              await this.initializeChatWithExistingChatMessages(model);
            } else {
              await this.initializeFreshChat(model);
            }
          } else {
            if (model.status === MeetingStatus.FOUND) {
              await this.initializeFreshChat(model);
            } else {
              this.clearChat();
            }
          }

          this.globalState.markMeetingAsLoaded();

          this.meetingState.set({
            status: model.status,
            meeting: model.meeting,
            request: model.request,
          });
        }),
        catchError(error => {
          this.globalState.markMeetingAsLoaded();

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
          this.meetingState.set(null);
          this.chatState.set(null);
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
          this.meetingState.set(null);
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

  findUser(userId: number): Observable<MeetingUserDto> {
    return this.http.get<MeetingUserDto>(
      `${environment.versionApiUrl}users/${userId}`,
    );
  }

  clearMeeting() {
    this.meetingState.set(null);
    this.clearChat();
  }

  private isSameMeeting(model): boolean {
    return (
      this.meetingState.data &&
      model.status === MeetingStatus.FOUND &&
      this.meetingState.data.status === MeetingStatus.FOUND &&
      model.meeting.id === this.meetingState.data.meeting.id
    );
  }

  private async initializeChatWithExistingChatMessages(model: MeetingModel) {
    const existingMessages = this.chatState.data.messages;
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
      const messages = [...this.chatState.data.messages, ...newMessages];

      this.chatState.set({
        messages,
      });

      if (this.router.url !== '/app/chat') {
        const lastMessageDate = await this.storage.get(
          storageKeys.lastMessageDate,
        );
        const notRedMessages = messages.filter(message => {
          return new Date(message.date) > new Date(lastMessageDate);
        });

        this.globalState.setToRead(notRedMessages.length);
      } else {
        this.storage.set(
          storageKeys.lastMessageDate,
          messages[messages.length - 1].date,
        );
      }
    } else {
      this.chatState.set({
        messages: newMessages,
      });

      if (this.router.url !== '/app/chat') {
        this.globalState.setToRead(newMessages.length);
      } else {
        this.storage.set(
          storageKeys.lastMessageDate,
          newMessages[newMessages.length - 1].date,
        );
      }
    }
  }

  private async initializeFreshChat(model: MeetingModel) {
    await this.storage.remove(storageKeys.lastMessageDate);

    this.chatState.set({
      messages: model.messages,
    });

    this.globalState.setToRead(model.messages.length);
  }

  private clearChat() {
    this.chatState.set(null);
    this.globalState.setToRead(0);
    this.storage.remove(storageKeys.lastMessageDate);
  }
}
