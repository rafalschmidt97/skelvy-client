import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDto } from '../user/user';
import { tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import {
  AddFriend,
  AddFriends,
  RemoveFriend,
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
        `${environment.versionApiUrl}users/self/blocked?page=${page}`,
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

  addBlockedUser(user: UserDto): Observable<void> {
    return this.http
      .post<void>(`${environment.versionApiUrl}users/self/blocked`, {
        blockUserId: user.id,
      })
      .pipe(
        tap(() => {
          this.store.dispatch(new AddFriend(user));
        }),
      );
  }

  removeBlockedUser(userId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.versionApiUrl}users/self/blocked/${userId}`)
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveFriend(userId));
        }),
      );
  }
}
