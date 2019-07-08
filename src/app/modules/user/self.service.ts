import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserState, UserStateModel } from './store/user-state';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SelfModel } from './self';
import {
  MeetingState,
  MeetingStateModel,
} from '../meeting/store/meeting-state';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MeetingService } from '../meeting/meeting.service';
import { GlobalState } from '../../core/state/global-state';
import { ChatMessageDto, MeetingStatus } from '../meeting/meeting';
import { forkJoin, Observable, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { storageKeys } from '../../core/storage/storage';
import {
  SettingsState,
  SettingsStateModel,
} from '../settings/store/settings-state';

@Injectable({
  providedIn: 'root',
})
export class SelfService {
  constructor(
    private readonly http: HttpClient,
    private readonly userState: UserState,
    private readonly meetingState: MeetingState,
    private readonly meetingService: MeetingService,
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
      this.storage.get(storageKeys.settingsState),
    ]).pipe(
      mergeMap(([user, meeting, settings]) => {
        if (user) {
          return this.fakeSelfRequestFromStorage(user, meeting).pipe(
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
        await this.initializeState(model, settings, fromStorage);
        await this.authService.refreshTokenIfExpired().toPromise();
        return { model, fromStorage };
      }),
      tap(({ fromStorage }) => {
        if (fromStorage) {
          this.meetingService.findMeeting(true).subscribe();
        }
      }),
      map(({ model }) => model),
    );
  }

  private fakeSelfRequestFromStorage(
    user: UserStateModel,
    meeting: MeetingStateModel,
  ): Observable<SelfModel> {
    if (meeting && meeting.meeting) {
      return of({
        user: user.user,
        meetingModel: {
          status: meeting.meeting.status,
          meeting: meeting.meeting.meeting,
          request: meeting.meeting.request,
          messages: <ChatMessageDto[]>meeting.meeting.messages,
        },
      });
    } else {
      return of({
        user: user.user,
        meetingModel: null,
      });
    }
  }

  private async initializeState(
    model: SelfModel,
    settings: SettingsStateModel,
    fromStorage: boolean,
  ) {
    this.userState.updateUser(model.user);

    if (model && model.meetingModel) {
      this.meetingState.updateMeeting(model.meetingModel);
    }

    if (settings && settings.blockedUsers) {
      this.settingsState.updateBlockedUsers(settings.blockedUsers);
    }

    if (fromStorage) {
      if (
        model.meetingModel &&
        model.meetingModel.status === MeetingStatus.FOUND
      ) {
        const lastMessageDate = await this.storage.get(
          storageKeys.lastMessageDate,
        );
        const notRedMessages = model.meetingModel.messages.filter(message => {
          return new Date(message.date) > new Date(lastMessageDate);
        });

        this.meetingState.setToRead(notRedMessages.length);
      }

      this.meetingState.markAsLoading();
    } else {
      if (
        model.meetingModel &&
        model.meetingModel.status === MeetingStatus.FOUND
      ) {
        this.meetingState.setToRead(model.meetingModel.messages.length);
      }
    }
  }
}
