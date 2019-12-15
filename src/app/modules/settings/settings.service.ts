import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FriendInvitation, UserDto, UserWithRoleDto } from '../user/user';
import { tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import {
  AddBlockedUser,
  AddBlockedUsers,
  AddFriend,
  AddFriends,
  RemoveBlockedUser,
  RemoveFriend,
  RemoveFriendInvitation,
  UpdateBlockedUsers,
  UpdateFriendInvitations,
  UpdateFriends,
} from './store/settings-actions';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

  findBlockedUsers(page: number = 1): Observable<UserDto[]> {
    return this.http
      .get<UserDto[]>(
        `${environment.versionApiUrl}relations/self/blocked?page=${page}`,
      )
      .pipe(
        tap(users => {
          if (page === 1) {
            this.store.dispatch(new UpdateBlockedUsers(users));
          } else {
            this.store.dispatch(new AddBlockedUsers(users));
          }
        }),
      );
  }

  addBlockedUser(user: UserDto): Observable<void> {
    return this.http
      .post<void>(`${environment.versionApiUrl}relations/self/blocked`, {
        blockUserId: user.id,
      })
      .pipe(
        tap(() => {
          this.store.dispatch(new AddBlockedUser(user));
        }),
      );
  }

  removeBlockedUser(userId: number): Observable<void> {
    return this.http
      .delete<void>(
        `${environment.versionApiUrl}relations/self/blocked/${userId}`,
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveBlockedUser(userId));
        }),
      );
  }

  findFriends(page: number = 1): Observable<UserDto[]> {
    return this.http
      .get<UserDto[]>(
        `${environment.versionApiUrl}relations/self/friends?page=${page}`,
      )
      .pipe(
        tap(users => {
          if (page === 1) {
            this.store.dispatch(new UpdateFriends(users));
          } else {
            this.store.dispatch(new AddFriends(users));
          }
        }),
      );
  }

  removeFriend(userId: number): Observable<void> {
    return this.http
      .delete<void>(
        `${environment.versionApiUrl}relations/self/friends/${userId}`,
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveFriend(userId));
        }),
      );
  }

  findFriendInvitations(): Observable<FriendInvitation[]> {
    return this.http
      .get<FriendInvitation[]>(
        `${environment.versionApiUrl}relations/self/friends/invitations`,
      )
      .pipe(
        tap(invitations => {
          this.store.dispatch(new UpdateFriendInvitations(invitations));
        }),
      );
  }

  inviteFriend(userId: number): Observable<void> {
    return this.http
      .post<void>(`${environment.versionApiUrl}relations/self/friends/invite`, {
        invitingUserId: userId,
      })
      .pipe(
        tap(() => {
          this.findFriendInvitations().subscribe();
        }),
      );
  }

  respondFriendInvitation(
    invitationId: any,
    isAccepted: any,
  ): Observable<void> {
    return this.http
      .post<void>(
        `${environment.versionApiUrl}relations/self/friends/respond`,
        { invitationId, isAccepted },
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveFriendInvitation(invitationId));

          if (isAccepted) {
            this.findFriends().subscribe();
          }
        }),
      );
  }

  findUsers(username: string, page: number = 1): Observable<UserWithRoleDto[]> {
    return this.http.get<UserWithRoleDto[]>(
      `${environment.versionApiUrl}users?userName=${username}&page=${page}`,
    );
  }

  clearFriend(userId: number) {
    this.store.dispatch(new RemoveFriend(userId));
  }
}
