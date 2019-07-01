import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from './user-store.service';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SelfModelDto } from './self';
import { MeetingStoreService } from '../meeting/meeting-store.service';
import { ChatStoreService } from '../chat/chat-store.service';
import { ChatMessageDto, ChatModel } from '../chat/chat';
import { Storage } from '@ionic/storage';
import { Connection } from './user';
import { TranslateService } from '@ngx-translate/core';
import { MeetingService } from '../meeting/meeting.service';

@Injectable({
  providedIn: 'root',
})
export class SelfService {
  constructor(
    private readonly http: HttpClient,
    private readonly userStore: UserStoreService,
    private readonly meetingStore: MeetingStoreService,
    private readonly meetingService: MeetingService,
    private readonly chatStore: ChatStoreService,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
  ) {}

  findSelf(): Observable<SelfModelDto> {
    return forkJoin(
      this.storage.get('user'),
      this.storage.get('meeting'),
      this.storage.get('chat'),
    ).pipe(
      flatMap(([user, meeting, chat]) => {
        if (user) {
          if (meeting) {
            return of({
              user,
              meetingModel: {
                status: meeting.status,
                meeting: meeting.meeting,
                messages: chat ? chat.messages : null,
                request: meeting.request,
              },
              fromStorage: true,
            });
          } else {
            return of({
              user,
              meetingModel: null,
              fromStorage: true,
            });
          }
        } else {
          return this.http.get<SelfModelDto>(
            `${environment.versionApiUrl}self?language=${this.translateService.currentLang}`,
          );
        }
      }),
      tap(async model => {
        const user = {
          connection: Connection.CONNECTED,
          id: model.user.id,
          profile: model.user.profile,
        };

        this.userStore.set(user);

        if (!model.fromStorage) {
          await this.storage.set('user', user);
        }

        if (model.meetingModel) {
          const meeting = {
            loading: false,
            status: model.meetingModel.status,
            meeting: model.meetingModel.meeting,
            request: model.meetingModel.request,
          };

          this.meetingStore.set(meeting);

          if (!model.fromStorage) {
            await this.storage.set('meeting', meeting);
          }

          if (model.meetingModel.messages) {
            const chat = await this.initializedChatModel(
              model.meetingModel.messages,
            );

            this.chatStore.set(chat);

            if (!model.fromStorage) {
              await this.storage.set('chat', chat);
            }
          }
        }

        if (model.fromStorage) {
          this.meetingService.findMeeting().subscribe();
        }
      }),
    );
  }

  private async initializedChatModel(
    messages: ChatMessageDto[],
  ): Promise<ChatModel> {
    const lastMessageDate = await this.storage.get('lastMessageDate');
    const notRedMessages = messages.filter(message => {
      return new Date(message.date) > new Date(lastMessageDate);
    });

    return {
      toRead: notRedMessages.length,
      messages: messages,
    };
  }
}
