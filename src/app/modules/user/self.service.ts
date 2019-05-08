import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from './user-store.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SelfModelDto } from './self';
import { MeetingStoreService } from '../meeting/meeting-store.service';
import { ChatStoreService } from '../chat/chat-store.service';
import { ChatMessageDto } from '../chat/chat';
import { Storage } from '@ionic/storage';
import { Connection } from './user';

@Injectable({
  providedIn: 'root',
})
export class SelfService {
  constructor(
    private readonly http: HttpClient,
    private readonly userStore: UserStoreService,
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly storage: Storage,
  ) {}

  findSelf(): Observable<SelfModelDto> {
    return this.http.get<SelfModelDto>(environment.apiUrl + 'self').pipe(
      tap(async model => {
        this.userStore.set({
          connection: Connection.CONNECTED,
          id: model.user.id,
          profile: model.user.profile,
        });

        if (model.meetingModel) {
          this.meetingStore.set({
            status: model.meetingModel.status,
            meeting: model.meetingModel.meeting,
            request: model.meetingModel.request,
          });

          if (model.meetingModel.meetingMessages) {
            const chatModel = await this.initializedChatModel(
              model.meetingModel.meetingMessages,
            );

            this.chatStore.set(chatModel);
          }
        }
      }),
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
