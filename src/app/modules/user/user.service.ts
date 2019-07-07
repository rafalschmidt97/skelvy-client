import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserState } from './store/user-state';
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
          this.userState.set(user);
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
          this.userState.updateProfile(profile);
        }),
      );
  }
}
