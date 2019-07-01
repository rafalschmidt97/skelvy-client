import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { MeetingStoreService } from './meeting-store.service';
import {
  MeetingDrinkTypeDto,
  MeetingModelDto,
  MeetingStatus,
  MeetingSuggestionsModel,
  MeetingUserDto,
} from './meeting';
import { ChatStoreService } from '../chat/chat-store.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private readonly http: HttpClient,
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
  ) {}

  findMeeting(): Observable<MeetingModelDto> {
    return this.http
      .get<MeetingModelDto>(
        `${environment.versionApiUrl}meetings/self?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(async model => {
          if (
            this.meetingStore.data &&
            model.status === MeetingStatus.FOUND &&
            this.meetingStore.data.status === MeetingStatus.FOUND &&
            model.meeting.id === this.meetingStore.data.meeting.id
          ) {
            const existingMessages = this.chatStore.data.messages;
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
              const messages = [
                ...this.chatStore.data.messages,
                ...newMessages,
              ];
              const lastMessageDate = await this.storage.get('lastMessageDate');
              const notRedMessages = messages.filter(message => {
                return new Date(message.date) > new Date(lastMessageDate);
              });
              console.log(this.chatStore.data.messages, newMessages);

              this.chatStore.set({
                toRead: notRedMessages.length,
                messages: messages,
              });
            } else {
              this.chatStore.set({
                toRead: newMessages.length,
                messages: newMessages,
              });
            }
          } else {
            if (model.status === MeetingStatus.FOUND) {
              const lastMessageDate = await this.storage.get('lastMessageDate');
              const notRedMessages = model.messages.filter(message => {
                return new Date(message.date) > new Date(lastMessageDate);
              });

              this.chatStore.set({
                toRead: notRedMessages.length,
                messages: model.messages,
              });
            } else {
              this.clearChat();
            }
          }

          this.meetingStore.set({
            loading: false,
            status: model.status,
            meeting: model.meeting,
            request: model.request,
          });
        }),
        catchError(error => {
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
          this.meetingStore.set(null);
          this.chatStore.set(null);
          this.storage.remove('lastMessageDate');
        }),
      );
  }

  createMeetingRequest(request): Observable<void> {
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
          this.meetingStore.set(null);
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
    this.meetingStore.set(null);
    this.clearChat();
  }

  clearChat() {
    this.chatStore.set(null);
    this.storage.remove('lastMessageDate');
  }
}
