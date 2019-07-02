import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from './user-store.service';
import { Observable } from 'rxjs';
import { UserDto } from './user';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly userStore: UserStoreService,
  ) {}

  findUser(): Observable<UserDto> {
    return this.http
      .get<UserDto>(environment.versionApiUrl + 'users/self')
      .pipe(
        tap(user => {
          this.userStore.setUser(user);
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
