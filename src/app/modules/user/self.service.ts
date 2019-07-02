import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from './user-store.service';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SelfModelDto } from './self';
import { MeetingStoreService } from '../meeting/meeting-store.service';
import { ChatStoreService } from '../chat/chat-store.service';
import { ChatModel } from '../chat/chat';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MeetingService } from '../meeting/meeting.service';
import { StateStoreService } from '../../core/state/state-store.service';
import { Connection, StateModel } from '../../core/state/state';
import { MeetingModel, MeetingStatus } from '../meeting/meeting';

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
    private readonly stateStore: StateStoreService,
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
          id: model.user.id,
          profile: model.user.profile,
        };
        this.userStore.set(user);

        let meeting, chat;

        if (model.meetingModel) {
          meeting = {
            status: model.meetingModel.status,
            meeting: model.meetingModel.meeting,
            request: model.meetingModel.request,
          };

          this.meetingStore.set(meeting);

          if (model.meetingModel.messages) {
            chat = { messages: model.meetingModel.messages };
            this.chatStore.set(chat);
          }
        }

        const state = await this.stateModel(meeting, chat, model.fromStorage);
        this.stateStore.set(state);

        if (model.fromStorage) {
          this.meetingService.findMeeting(true).subscribe();
        } else {
          await this.storage.set('user', user);
          await this.storage.set('meeting', meeting);
          await this.storage.set('chat', chat);
        }
      }),
    );
  }

  private async stateModel(
    meeting: MeetingModel,
    chat: ChatModel,
    fromStorage: boolean,
  ): Promise<StateModel> {
    if (fromStorage) {
      if (meeting && meeting.status === MeetingStatus.FOUND) {
        const lastMessageDate = await this.storage.get('lastMessageDate');
        const notRedMessages = chat.messages.filter(message => {
          return new Date(message.date) > new Date(lastMessageDate);
        });

        return {
          loggedIn: true,
          connection: Connection.CONNECTING,
          toRead: notRedMessages.length,
          loadingUser: false,
          loadingMeeting: true,
        };
      } else {
        return {
          loggedIn: true,
          connection: Connection.CONNECTING,
          toRead: 0,
          loadingUser: false,
          loadingMeeting: true,
        };
      }
    } else {
      if (meeting && meeting.status === MeetingStatus.FOUND) {
        return {
          loggedIn: true,
          connection: Connection.CONNECTING,
          toRead: chat.messages.length,
          loadingUser: false,
          loadingMeeting: false,
        };
      } else {
        return {
          loggedIn: true,
          connection: Connection.CONNECTING,
          toRead: 0,
          loadingUser: false,
          loadingMeeting: false,
        };
      }
    }
  }
}
