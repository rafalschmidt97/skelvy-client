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

  getUser(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + 'users/self').pipe(
      tap((user: User) => {
        this.userStore.set(user);
      }),
    );
  }
}
