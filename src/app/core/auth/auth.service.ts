import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from '../../modules/user/user-store.service';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MeetingStoreService } from '../../modules/meeting/meeting-store.service';
import { Storage } from '@ionic/storage';
import { ChatStoreService } from '../../modules/chat/chat-store.service';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jwt: JwtHelperService;

  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService,
    private readonly userStore: UserStoreService,
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly storage: Storage,
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
  ) {
    this.jwt = new JwtHelperService();
  }

  signInWithFacebook(authToken: string, language: string): Observable<any> {
    return this.http
      .post<any>(environment.versionApiUrl + 'auth/facebook', {
        authToken,
        language,
      })
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
      .post<any>(environment.versionApiUrl + 'auth/google', {
        authToken,
        language,
      })
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
          .post<any>(environment.versionApiUrl + 'auth/refresh', {
            refreshToken,
          })
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

  refreshTokenIfExpired(): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(async token => {
        const isExpired =
          token && token.accessToken
            ? this.jwt.isTokenExpired(token.accessToken)
            : true;

        return { isExpired, token };
      }),
      mergeMap(({ isExpired, token }) => {
        return isExpired
          ? this.http
              .post<any>(environment.versionApiUrl + 'auth/refresh', {
                refreshToken: token.refreshToken,
              })
              .pipe(
                map(async res => {
                  if (res && res.accessToken && res.refreshToken) {
                    await this.sessionService.createSession(res);
                  }

                  return res;
                }),
              )
          : of(token);
      }),
    );
  }

  logout(): Observable<any> {
    return from(this.getRefreshToken()).pipe(
      switchMap(refreshToken => {
        return this.http
          .post<any>(environment.versionApiUrl + 'auth/logout', {
            refreshToken,
          })
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
    await this.storage.remove('pushTopicUser');
    await this.storage.remove('lastMeetingRequestForm');

    await this.storage.remove('user');
    await this.storage.remove('meeting');
    await this.storage.remove('chat');
  }

  private getToken(): Promise<any> {
    return this.sessionService.getSession();
  }

  private async getRefreshToken(): Promise<string> {
    const session = await this.getToken();
    return session ? session.refreshToken : '';
  }
}
