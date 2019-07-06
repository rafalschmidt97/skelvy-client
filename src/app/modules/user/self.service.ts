import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserState } from './user-state';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SelfModel } from './self';
import { MeetingState } from '../meeting/meeting-state';
import { ChatState } from '../chat/chat-state';
import { ChatStateModel } from '../chat/chat';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MeetingService } from '../meeting/meeting.service';
import { GlobalState } from '../../core/state/global-state';
import { Connection, GlobalStateModel } from '../../core/state/global';
import { MeetingStateModel, MeetingStatus } from '../meeting/meeting';
import { forkJoin, Observable, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { storageKeys } from '../../core/storage/storage';
import { SettingsState } from '../settings/settings-state';
import { SettingsStateModel } from '../settings/settings';

@Injectable({
  providedIn: 'root',
})
export class SelfService {
  constructor(
    private readonly http: HttpClient,
    private readonly userState: UserState,
    private readonly meetingState: MeetingState,
    private readonly meetingService: MeetingService,
    private readonly chatState: ChatState,
    private readonly globalState: GlobalState,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly settingsState: SettingsState,
  ) {}

  findSelf(): Observable<SelfModel> {
    return forkJoin([
      this.storage.get(storageKeys.userState),
      this.storage.get(storageKeys.meetingState),
      this.storage.get(storageKeys.chatState),
      this.storage.get(storageKeys.settingsState),
    ]).pipe(
      mergeMap(([user, meeting, chat, settings]) => {
        if (user) {
          return this.fakeSelfRequestFromStorage(user, meeting, chat).pipe(
            map(model => {
              return { model, settings, fromStorage: true };
            }),
          );
        } else {
          return this.http
            .get<SelfModel>(
              `${environment.versionApiUrl}self?language=${this.translateService.currentLang}`,
            )
            .pipe(
              map(model => {
                return { model, settings, fromStorage: false };
              }),
            );
        }
      }),
      switchMap(async ({ model, settings, fromStorage }) => {
        const { user, meeting, chat } = await this.initializeState(
          model,
          settings,
          fromStorage,
        );

        await this.authService.refreshTokenIfExpired().toPromise();

        return { model, fromStorage, user, meeting, chat };
      }),
      tap(async ({ fromStorage, user, meeting, chat }) => {
        if (fromStorage) {
          this.meetingService.findMeeting(true).subscribe();
        } else {
          await this.saveStateToStorage(user, meeting, chat);
        }
      }),
      map(({ model }) => model),
    );
  }

  private async saveStateToStorage(user, meeting, chat) {
    await this.storage.set(storageKeys.userState, user);
    await this.storage.set(storageKeys.meetingState, meeting);
    await this.storage.set(storageKeys.chatState, chat);
  }

  private fakeSelfRequestFromStorage(
    user,
    meeting,
    chat,
  ): Observable<SelfModel> {
    if (meeting) {
      return of({
        user,
        meetingModel: {
          status: meeting.status,
          meeting: meeting.meeting,
          messages: chat ? chat.messages : null,
          request: meeting.request,
        },
      });
    } else {
      return of({
        user,
        meetingModel: null,
      });
    }
  }

  private async initializeState(
    model: SelfModel,
    settings: SettingsStateModel,
    fromStorage: boolean,
  ) {
    const user = {
      id: model.user.id,
      profile: model.user.profile,
    };
    this.userState.set(user);

    let meeting, chat;

    if (model.meetingModel) {
      meeting = {
        status: model.meetingModel.status,
        meeting: model.meetingModel.meeting,
        request: model.meetingModel.request,
      };

      this.meetingState.set(meeting);

      if (model.meetingModel.messages) {
        chat = { messages: model.meetingModel.messages };
        this.chatState.set(chat);
      }
    }

    if (settings) {
      this.settingsState.set(settings);
    } else {
      this.settingsState.set({ blockedUsers: null });
    }

    const state = await this.stateModel(meeting, chat, fromStorage);
    this.globalState.set(state);
    return { user, meeting, chat };
  }

  private async stateModel(
    meeting: MeetingStateModel,
    chat: ChatStateModel,
    fromStorage: boolean,
  ): Promise<GlobalStateModel> {
    if (fromStorage) {
      if (meeting && meeting.status === MeetingStatus.FOUND) {
        const lastMessageDate = await this.storage.get(
          storageKeys.lastMessageDate,
        );
        const notRedMessages = chat.messages.filter(message => {
          return new Date(message.date) > new Date(lastMessageDate);
        });

        return {
          connection: Connection.CONNECTING,
          toRead: notRedMessages.length,
          loadingUser: false,
          loadingMeeting: true,
        };
      } else {
        return {
          connection: Connection.CONNECTING,
          toRead: 0,
          loadingUser: false,
          loadingMeeting: true,
        };
      }
    } else {
      if (meeting && meeting.status === MeetingStatus.FOUND) {
        return {
          connection: Connection.CONNECTING,
          toRead: chat.messages.length,
          loadingUser: false,
          loadingMeeting: false,
        };
      } else {
        return {
          connection: Connection.CONNECTING,
          toRead: 0,
          loadingUser: false,
          loadingMeeting: false,
        };
      }
    }
  }
}
