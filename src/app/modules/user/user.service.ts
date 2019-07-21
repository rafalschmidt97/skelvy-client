import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ProfileRequest, SelfUserDto } from './user';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import {
  ChangeUserLoadingStatus,
  UpdateProfile,
  UpdateUser,
} from './store/user-actions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

  findUser(markedAsLoading: boolean = false): Observable<SelfUserDto> {
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
}
