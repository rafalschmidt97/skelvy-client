import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from '../../modules/user/user-store.service';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MeetingStoreService } from '../../modules/meeting/meeting-store.service';
import { Storage } from '@ionic/storage';
import { ChatStoreService } from '../../modules/chat/chat-store.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { switchMap } from 'rxjs/internal/operators/switchMap';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService,
    private readonly userStore: UserStoreService,
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly storage: Storage,
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
  ) {}

  signInWithFacebook(authToken: string, language: string): Observable<any> {
    return this.http
      .post<any>(environment.apiUrl + 'auth/facebook', { authToken, language })
      .pipe(
        tap(async res => {
          if (res && res.accessToken && res.refreshToken) {
            await this.sessionService.createSession(res);
          }
        }),
      );
  }

  signInWithGoogle(authToken: string, language: string): Observable<any> {
    return this.http
      .post<any>(environment.apiUrl + 'auth/google', { authToken, language })
      .pipe(
        tap(async res => {
          if (res && res.accessToken && res.refreshToken) {
            await this.sessionService.createSession(res);
          }
        }),
      );
  }

  refreshToken(): Observable<any> {
    return from(this.getRefreshToken()).pipe(
      switchMap(refreshToken => {
        return this.http
          .post<any>(environment.apiUrl + 'auth/refresh', { refreshToken })
          .pipe(
            tap(async res => {
              if (res && res.accessToken && res.refreshToken) {
                await this.sessionService.createSession(res);
              }
            }),
          );
      }),
    );
  }

  logout(): Observable<any> {
    return from(this.getRefreshToken()).pipe(
      switchMap(refreshToken => {
        return this.http
          .post<any>(environment.apiUrl + 'auth/logout', { refreshToken })
          .pipe(
            tap(async () => {
              await this.logoutWithoutRequest();
            }),
          );
      }),
    );
  }

  async logoutWithoutRequest() {
    await this.sessionService.removeSession();
    this.userStore.set(null);
    this.meetingStore.set(null);
    this.chatStore.set(null);
    await this.storage.remove('lastMessageDate');

    const method = await this.storage.get('signInMethod');

    if (method === 'facebook') {
      await this.facebook.logout();
    } else if (method === 'google') {
      await this.google.logout();
    }

    await this.storage.remove('signInMethod');
  }

  private async getRefreshToken(): Promise<string> {
    const session = await this.sessionService.getSession();
    return session ? session.refreshToken : '';
  }
}
