import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserStoreService } from './user-store.service';
import { Observable, throwError } from 'rxjs';
import { UserDto } from './user';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StateStoreService } from '../../core/state/state-store.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly userStore: UserStoreService,
    private readonly stateStore: StateStoreService,
  ) {}

  findUser(markedAsLoading: boolean = false): Observable<UserDto> {
    if (!markedAsLoading) {
      this.stateStore.markUserAsLoading();
    }

    return this.http
      .get<UserDto>(environment.versionApiUrl + 'users/self')
      .pipe(
        tap(user => {
          this.userStore.setUser(user);
          this.stateStore.markUserAsLoaded();
        }),
        catchError(error => {
          this.stateStore.markUserAsLoaded();
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

  updateProfile(profile): Observable<void> {
    return this.http
      .put<void>(environment.versionApiUrl + 'users/self/profile', profile)
      .pipe(
        tap(() => {
          this.userStore.setProfile(profile);
        }),
      );
  }

  getBlockedUsers(page: number = 1): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(
      `${environment.versionApiUrl}users/self/blocked?page=${page}`,
    );
  }

  addBlockUser(id: number): Observable<void> {
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
