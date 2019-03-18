import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from './user-store.service';
import { Observable } from 'rxjs';
import { User } from './user';
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

  findUser(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + 'users/self').pipe(
      tap(user => {
        this.userStore.set(user);
      }),
    );
  }

  removeUser(): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + 'users/self');
  }

  updateProfile(profile): Observable<void> {
    return this.http
      .put<void>(environment.apiUrl + 'users/self/profile', profile)
      .pipe(
        tap(() => {
          this.findUser().subscribe();
        }),
      );
  }

  assignDevice(registrationId): Observable<void> {
    return this.http.post<void>(environment.apiUrl + 'users/self/devices', {
      registrationId,
    });
  }
}
