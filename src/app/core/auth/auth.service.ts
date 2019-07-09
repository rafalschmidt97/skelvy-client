import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthDto, TokenDto } from './auth';
import { storageKeys } from '../storage/storage';
import { Store } from '@ngxs/store';
import { ClearState } from '../redux/redux';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jwt: JwtHelperService;

  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService,
    private readonly storage: Storage,
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
    private readonly store: Store,
  ) {
    this.jwt = new JwtHelperService();
  }

  signInWithFacebook(authToken: string, language: string): Observable<AuthDto> {
    return this.http
      .post<AuthDto>(environment.versionApiUrl + 'auth/facebook', {
        authToken,
        language,
      })
      .pipe(
        tap(async res => {
          if (res && res.accessToken && res.refreshToken) {
            await this.sessionService.createSession(res);
          }

          await this.storage.set(storageKeys.signInMethod, 'facebook');
        }),
      );
  }

  signInWithGoogle(authToken: string, language: string): Observable<AuthDto> {
    return this.http
      .post<AuthDto>(environment.versionApiUrl + 'auth/google', {
        authToken,
        language,
      })
      .pipe(
        tap(async res => {
          if (res && res.accessToken && res.refreshToken) {
            await this.sessionService.createSession(res);
          }

          await this.storage.set(storageKeys.signInMethod, 'google');
        }),
      );
  }

  refreshToken(): Observable<TokenDto> {
    return from(this.getRefreshToken()).pipe(
      switchMap(refreshToken => {
        return this.http.post<TokenDto>(
          environment.versionApiUrl + 'auth/refresh',
          {
            refreshToken,
          },
        );
      }),
      switchMap(async res => {
        if (res && res.accessToken && res.refreshToken) {
          await this.sessionService.createSession(res);
        }

        return res;
      }),
    );
  }

  refreshTokenIfExpired(): Observable<TokenDto> {
    return from(this.getToken()).pipe(
      switchMap(async token => {
        const isExpired =
          token && token.accessToken
            ? this.jwt.isTokenExpired(token.accessToken)
            : true;

        return { isExpired, token };
      }),
      switchMap(({ isExpired, token }) => {
        return isExpired
          ? this.http
              .post<TokenDto>(environment.versionApiUrl + 'auth/refresh', {
                refreshToken: token.refreshToken,
              })
              .pipe(
                map(res => {
                  return { isExpired, res };
                }),
              )
          : of({ isExpired, res: token });
      }),
      switchMap(async ({ isExpired, res }) => {
        if (isExpired && res && res.accessToken && res.refreshToken) {
          await this.sessionService.createSession(res);
        }

        return res;
      }),
    );
  }

  logout(): Observable<void> {
    return from(this.getRefreshToken()).pipe(
      switchMap(refreshToken => {
        return this.http
          .post<void>(environment.versionApiUrl + 'auth/logout', {
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
    this.store.dispatch(new ClearState());
    await this.sessionService.removeSession();
    await this.storage.remove(storageKeys.lastMessageDate);

    const method = await this.storage.get(storageKeys.signInMethod);

    if (method === 'facebook') {
      await this.facebook.logout();
    } else if (method === 'google') {
      await this.google.logout();
    }

    await this.storage.remove(storageKeys.signInMethod);
    await this.storage.remove(storageKeys.pushTopicUser);
    await this.storage.remove(storageKeys.lastRequestForm);

    await this.storage.remove(storageKeys.userState);
    await this.storage.remove(storageKeys.meetingState);
    await this.storage.remove(storageKeys.settingsState);
  }

  private getToken(): Promise<TokenDto> {
    return this.sessionService.getSession();
  }

  private async getRefreshToken(): Promise<string> {
    const session = await this.getToken();
    return session ? session.refreshToken : null;
  }
}
