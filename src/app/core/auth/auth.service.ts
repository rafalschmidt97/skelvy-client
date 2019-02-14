import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from '../../modules/profile/user-store.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MeetingStoreService } from '../../modules/meeting/meeting-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService,
    private readonly userStore: UserStoreService,
    private readonly meetingStore: MeetingStoreService,
  ) {}

  signInWithFacebook(authToken: string): Observable<any> {
    return this.http
      .post<any>(environment.apiUrl + 'auth/facebook', { authToken })
      .pipe(
        tap(async res => {
          if (res && res.token) {
            await this.sessionService.createSession(res.token);
          }
        }),
      );
  }

  signInWithGoogle(authToken: string): Observable<any> {
    return this.http
      .post<any>(environment.apiUrl + 'auth/google', { authToken })
      .pipe(
        tap(async res => {
          if (res && res.token) {
            await this.sessionService.createSession(res.token);
          }
        }),
      );
  }

  async logout() {
    await this.sessionService.removeSession();
    this.userStore.set(null);
    this.meetingStore.set(null);
  }
}
