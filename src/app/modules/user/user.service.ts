import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from './user-store.service';
import { Observable } from 'rxjs';
import { ProfileDto, UserDto } from './user';
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

  updateProfile(profile: ProfileDto): Observable<void> {
    return this.http
      .put<void>(environment.versionApiUrl + 'users/self/profile', profile)
      .pipe(
        tap(() => {
          this.findUser().subscribe();
        }),
      );
  }
}
