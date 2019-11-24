import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SyncModel } from './sync';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MeetingService } from '../meeting/meeting.service';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { storageKeys } from '../../core/storage/storage';
import { Store } from '@ngxs/store';
import { UpdateUser } from './store/user-actions';
import { SelfUserDto, UserDto } from './user';
import {
  UpdateFriendInvitations,
  UpdateFriends,
  UpdateMeetingInvitations,
} from '../settings/store/settings-actions';
import { UpdateMeetingsState } from '../meeting/store/meeting-actions';

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

  self(): Observable<any> {
    return forkJoin([
      this.storage.get(storageKeys.user),
      this.storage.get(storageKeys.meetings),
      this.storage.get(storageKeys.groups),
      this.storage.get(storageKeys.requests),
      this.storage.get(storageKeys.friends),
      this.storage.get(storageKeys.friendInvitations),
      this.storage.get(storageKeys.meetingInvitations),
    ]).pipe(
      mergeMap(
        async ([
          user,
          meetings,
          groups,
          requests,
          friends,
          friendInvitations,
          meetingInvitations,
        ]) => {
          await this.authService.refreshTokenIfExpired().toPromise();

          if (!user) {
            user = await this.http
              .get<SelfUserDto>(environment.versionApiUrl + 'users/self')
              .toPromise();
          }

          if (
            !meetings ||
            !groups ||
            !requests ||
            !friendInvitations ||
            !meetingInvitations
          ) {
            const sync = await this.sync().toPromise();
            await this.initializeState(user, sync, friends);
            return { fromStorage: false };
          } else {
            await this.initializeState(
              user,
              {
                meetings,
                groups,
                requests,
                friendInvitations,
                meetingInvitations,
              },
              friends,
            );
            return { fromStorage: true };
          }
        },
      ),
      tap(({ fromStorage }) => {
        if (fromStorage) {
          this.sync().subscribe();
        }
      }),
    );
  }

  sync(): Observable<SyncModel> {
    return this.http
      .get<SyncModel>(
        `${environment.versionApiUrl}users/self/sync?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(async sync => {
          await this.initializeSync(sync);
        }),
      );
  }

  private async initializeState(
    user: SelfUserDto,
    sync: SyncModel,
    friends: UserDto[],
  ) {
    await this.initializeSync(sync);

    this.store.dispatch(new UpdateUser(user));

    if (friends) {
      this.store.dispatch(new UpdateFriends(friends));
    }
  }

  private async initializeSync(sync: SyncModel) {
    this.store.dispatch(
      new UpdateMeetingsState(sync.meetings, sync.requests, sync.groups),
    );
    this.store.dispatch(new UpdateFriendInvitations(sync.friendInvitations));
    this.store.dispatch(new UpdateMeetingInvitations(sync.meetingInvitations));
    // TODO: set not red messages
  }
}
