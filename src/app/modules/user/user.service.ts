import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserState } from './user-state';
import { Observable, throwError } from 'rxjs';
import { ProfileRequest, UserDto } from './user';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GlobalState } from '../../core/state/global-state';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly userState: UserState,
    private readonly globalState: GlobalState,
  ) {}

  findUser(markedAsLoading: boolean = false): Observable<UserDto> {
    if (!markedAsLoading) {
      this.globalState.markUserAsLoading();
    }

    return this.http
      .get<UserDto>(environment.versionApiUrl + 'users/self')
      .pipe(
        tap(user => {
          this.userState.setUser(user);
          this.globalState.markUserAsLoaded();
        }),
        catchError(error => {
          this.globalState.markUserAsLoaded();
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
          this.userState.setProfile(profile);
        }),
      );
  }

  getBlockedUsers(page: number = 1): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(
      `${environment.versionApiUrl}users/self/blocked?page=${page}`,
    );
  }

  addBlockedUser(id: number): Observable<void> {
    return this.http.post<void>(
      `${environment.versionApiUrl}users/self/blocked`,
      { blockUserId: id },
    );
  }

  removeBlockedUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.versionApiUrl}users/self/blocked/${id}`,
    );
  }
}
