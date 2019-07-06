import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDto } from '../user/user';
import { SettingsState } from './settings-state';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(
    private readonly http: HttpClient,
    private readonly settingsState: SettingsState,
  ) {}

  findBlockedUsers(page: number = 1): Observable<UserDto[]> {
    return this.http
      .get<UserDto[]>(
        `${environment.versionApiUrl}users/self/blocked?page=${page}`,
      )
      .pipe(
        tap(users => {
          if (page === 1) {
            this.settingsState.setBlockedUsers(users);
          } else {
            this.settingsState.addBlockedUsers(users);
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
          this.settingsState.addBlockedUser(user);
        }),
      );
  }

  removeBlockedUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.versionApiUrl}users/self/blocked/${id}`)
      .pipe(
        tap(() => {
          this.settingsState.removeBlockedUser(id);
        }),
      );
  }
}
