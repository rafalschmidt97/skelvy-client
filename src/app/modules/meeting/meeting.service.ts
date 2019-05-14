import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { MeetingStoreService } from './meeting-store.service';
import { MeetingDrinkDto, MeetingModelDto, MeetingRequestDto } from './meeting';
import { ChatStoreService } from '../chat/chat-store.service';
import { Storage } from '@ionic/storage';
import { ChatMessageDto } from '../chat/chat';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(
    private readonly http: HttpClient,
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly storage: Storage,
  ) {}

  findMeeting(): Observable<MeetingModelDto> {
    return this.http
      .get<MeetingModelDto>(environment.versionApiUrl + 'meetings/self')
      .pipe(
        tap(async model => {
          this.meetingStore.set({
            status: model.status,
            meeting: model.meeting,
            request: model.request,
          });

          if (model.meetingMessages) {
            const chatModel = await this.initializedChatModel(
              model.meetingMessages,
            );

            this.chatStore.set(chatModel);
          }
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

  createMeetingRequest(request: MeetingRequestDto): Observable<void> {
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

  findDrinks(): Observable<MeetingDrinkDto[]> {
    return this.http.get<MeetingDrinkDto[]>(
      environment.versionApiUrl + 'drinks',
    );
  }

  private async initializedChatModel(messages: ChatMessageDto[]) {
    const lastMessageDate = await this.storage.get('lastMessageDate');
    const notRedMessages = messages.filter(message => {
      return new Date(message.date) > new Date(lastMessageDate);
    });

    return {
      messagesToRead: notRedMessages.length,
      page: 1,
      messages: messages,
    };
  }
}
