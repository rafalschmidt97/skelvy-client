import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SyncModel } from './sync';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MeetingsService } from '../meetings/meetings.service';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { storageKeys } from '../../core/storage/storage';
import { Store } from '@ngxs/store';
import {
  UpdateFriendInvitations,
  UpdateFriends,
  UpdateUser,
} from './store/user-actions';
import { SelfUserDto, UserDto } from './user';
import {
  UpdateMeetingInvitations,
  UpdateMeetingsState,
} from '../meetings/store/meetings-actions';

@Injectable({
  providedIn: 'root',
})
export class SelfService {
  constructor(
    private readonly http: HttpClient,
    private readonly meetingService: MeetingsService,
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
            await this.storage.set(storageKeys.user, user);
          }

          if (
            !meetings ||
            !groups ||
            !requests ||
            !friendInvitations ||
            !meetingInvitations
          ) {
            await this.sync()
              .pipe(
                tap(async sync => {
                  await this.storage.set(storageKeys.meetings, sync.meetings);
                  await this.storage.set(storageKeys.requests, sync.requests);
                  await this.storage.set(storageKeys.groups, sync.groups);
                  await this.storage.set(
                    storageKeys.friendInvitations,
                    sync.friendInvitations,
                  );
                  await this.storage.set(
                    storageKeys.meetingInvitations,
                    sync.meetingInvitations,
                  );
                }),
              )
              .toPromise();
            this.initializeUser(user);
            this.initializeFriends(friends);
            return { fromStorage: false };
          } else {
            this.initializeSync({
              meetings,
              groups,
              requests,
              friendInvitations,
              meetingInvitations,
            });
            this.initializeUser(user);
            this.initializeFriends(friends);
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

  private initializeFriends(friends: UserDto[]) {
    if (friends) {
      this.store.dispatch(new UpdateFriends(friends));
    }
  }

  private initializeUser(user: SelfUserDto) {
    this.store.dispatch(new UpdateUser(user));
  }

  private initializeSync(sync: SyncModel) {
    this.store.dispatch(
      new UpdateMeetingsState(sync.meetings, sync.requests, sync.groups),
    );
    this.store.dispatch(new UpdateFriendInvitations(sync.friendInvitations));
    this.store.dispatch(new UpdateMeetingInvitations(sync.meetingInvitations));
    // TODO: set not red messages
  }
}
