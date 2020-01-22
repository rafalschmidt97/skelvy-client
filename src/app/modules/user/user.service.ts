import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  FriendInvitation,
  ProfileRequest,
  RelationDto,
  SelfUserDto,
  UserDto,
} from './user';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import {
  AddBlockedUser,
  AddBlockedUsers,
  AddFriends,
  ChangeUserLoadingStatus,
  RemoveBlockedUser,
  RemoveFriend,
  RemoveFriendInvitation,
  UpdateBlockedUsers,
  UpdateFriendInvitations,
  UpdateFriends,
  UpdateProfile,
  UpdateUser,
  UpdateUserEmail,
  UpdateUserName,
} from './store/user-actions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

  findSelf(markedAsLoading: boolean = false): Observable<SelfUserDto> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeUserLoadingStatus(true));
    }

    return this.http
      .get<SelfUserDto>(environment.versionApiUrl + 'users/self')
      .pipe(
        tap(user => {
          this.store.dispatch(new UpdateUser(user));
          this.store.dispatch(new ChangeUserLoadingStatus(false));
        }),
        catchError(error => {
          this.store.dispatch(new ChangeUserLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  updateLanguage(language: string): Observable<void> {
    return this.http.patch<void>(
      environment.versionApiUrl + 'users/self/language',
      {
        language,
      },
    );
  }

  updateProfile(profile: ProfileRequest): Observable<void> {
    return this.http
      .put<void>(environment.versionApiUrl + 'users/self/profile', profile)
      .pipe(
        tap(() => {
          this.store.dispatch(new UpdateProfile(profile));
        }),
      );
  }

  updateName(name: string): Observable<void> {
    return this.http
      .patch<void>(environment.versionApiUrl + 'users/self/name', {
        name,
      })
      .pipe(
        tap(() => {
          this.store.dispatch(new UpdateUserName(name));
        }),
      );
  }

  updateEmail(email: string): Observable<void> {
    return this.http
      .patch<void>(environment.versionApiUrl + 'users/self/email', {
        email,
      })
      .pipe(
        tap(() => {
          this.store.dispatch(new UpdateUserEmail(email));
        }),
      );
  }

  checkNameAvailable(name: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.versionApiUrl}users/name-available?name=${name}`,
    );
  }

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
        blockingUserId: user.id,
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
      .post<void>(
        `${environment.versionApiUrl}relations/self/friends/invitations`,
        {
          invitingUserId: userId,
        },
      )
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
        `${environment.versionApiUrl}relations/self/friends/invitations/${invitationId}/respond`,
        { isAccepted },
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

  findUsers(username: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(
      `${environment.versionApiUrl}users?userName=${username}`,
    );
  }

  checkRelation(userId: number): Observable<RelationDto> {
    return this.http.get<RelationDto>(
      `${environment.versionApiUrl}relations/self/check/${userId}`,
    );
  }

  clearFriend(userId: number) {
    this.store.dispatch(new RemoveFriend(userId));
  }
}
