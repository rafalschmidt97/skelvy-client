import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SelfModel } from './self';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MeetingService } from '../meeting/meeting.service';
import {
  ChatMessageDto,
  MeetingModel,
  MeetingStatus,
} from '../meeting/meeting';
import { forkJoin, Observable, of } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { storageKeys } from '../../core/storage/storage';
import { Store } from '@ngxs/store';
import { UpdateUser } from './store/user-actions';
import {
  UpdateChatMessagesToRead,
  UpdateMeeting,
} from '../meeting/store/meeting-actions';
import { UpdateBlockedUsers } from '../settings/store/settings-actions';
import { SelfUserDto, UserDto } from './user';

@Injectable({
  providedIn: 'root',
})
export class SelfService {
  constructor(
    private readonly http: HttpClient,
    private readonly meetingService: MeetingService,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {}

  findSelf(): Observable<SelfModel> {
    return forkJoin([
      this.storage.get(storageKeys.user),
      this.storage.get(storageKeys.meeting),
      this.storage.get(storageKeys.blockedUsers),
    ]).pipe(
      mergeMap(([user, meeting, blockedUsers]) => {
        if (user) {
          return this.fakeSelfRequestFromStorage(user, meeting).pipe(
            map(model => {
              return { model, blockedUsers, fromStorage: true };
            }),
          );
        } else {
          return this.http
            .get<SelfModel>(
              `${environment.versionApiUrl}self?language=${this.translateService.currentLang}`,
            )
            .pipe(
              map(model => {
                return { model, blockedUsers, fromStorage: false };
              }),
            );
        }
      }),
      switchMap(async ({ model, blockedUsers, fromStorage }) => {
        await this.initializeState(model, blockedUsers, fromStorage);
        await this.authService.refreshTokenIfExpired().toPromise();
        return { model, fromStorage };
      }),
      tap(({ fromStorage }) => {
        if (fromStorage) {
          this.meetingService.findMeeting().subscribe();
        }
      }),
      map(({ model }) => model),
    );
  }

  private fakeSelfRequestFromStorage(
    user: SelfUserDto,
    meetingModel: MeetingModel,
  ): Observable<SelfModel> {
    if (meetingModel) {
      return of({
        user: user,
        meetingModel: {
          status: meetingModel.status,
          meeting: meetingModel.meeting,
          request: meetingModel.request,
          messages: <ChatMessageDto[]>meetingModel.messages,
        },
      });
    } else {
      return of({
        user: user,
        meetingModel: null,
      });
    }
  }

  private async initializeState(
    model: SelfModel,
    blockedUsers: UserDto[],
    fromStorage: boolean,
  ) {
    this.store.dispatch(new UpdateUser(model.user));

    if (model && model.meetingModel) {
      this.store.dispatch(new UpdateMeeting(model.meetingModel));
    }

    if (blockedUsers) {
      this.store.dispatch(new UpdateBlockedUsers(blockedUsers));
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

        this.store.dispatch(
          new UpdateChatMessagesToRead(notRedMessages.length),
        );
      }
    } else {
      if (
        model.meetingModel &&
        model.meetingModel.status === MeetingStatus.FOUND
      ) {
        this.store.dispatch(
          new UpdateChatMessagesToRead(model.meetingModel.messages.length),
        );
      }
    }
  }
}
