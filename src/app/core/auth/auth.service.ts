import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthDto, TokenDto } from './auth';
import { storageKeys } from '../storage/storage';
import { Store } from '@ngxs/store';
import { ClearState } from '../redux/redux';
import { UserPushService } from '../../modules/user/user-push.service';
import { StateTrackerService } from '../state/state-tracker.service';
import { TranslateService } from '@ngx-translate/core';

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
    private readonly userPush: UserPushService,
    private readonly stateTracker: StateTrackerService,
    private readonly translateService: TranslateService,
  ) {
    this.jwt = new JwtHelperService();
  }

  signInWithFacebook(authToken: string): Observable<AuthDto> {
    return this.http
      .post<AuthDto>(environment.versionApiUrl + 'auth/facebook', {
        authToken,
        language: this.translateService.currentLang,
      })
      .pipe(
        switchMap(async res => {
          if (res && res.accessToken && res.refreshToken) {
            await this.sessionService.createSession(res);
          }

          await this.storage.set(storageKeys.signInMethod, 'facebook');

          return res;
        }),
      );
  }

  signInWithGoogle(authToken: string): Observable<AuthDto> {
    return this.http
      .post<AuthDto>(environment.versionApiUrl + 'auth/google', {
        authToken,
        language: this.translateService.currentLang,
      })
      .pipe(
        switchMap(async res => {
          if (res && res.accessToken && res.refreshToken) {
            await this.sessionService.createSession(res);
          }

          await this.storage.set(storageKeys.signInMethod, 'google');

          return res;
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
        return this.http.post<void>(environment.versionApiUrl + 'auth/logout', {
          refreshToken,
        });
      }),
      switchMap(async res => {
        await this.logoutWithoutRequest();
        return res;
      }),
    );
  }

  async logoutWithoutRequest() {
    this.stateTracker.stop();
    await this.sessionService.removeSession();
    await this.userPush.disconnect();

    const method = await this.storage.get(storageKeys.signInMethod);

    if (method === 'facebook') {
      try {
        await this.facebook.logout();
      } catch (e) {}
    } else if (method === 'google') {
      try {
        await this.google.logout();
      } catch (e) {}
    }

    await this.storage.remove(storageKeys.signInMethod);

    await this.storage.remove(storageKeys.user);
    await this.storage.remove(storageKeys.meetings);
    await this.storage.remove(storageKeys.requests);
    await this.storage.remove(storageKeys.groups);
    await this.storage.remove(storageKeys.friends);
    await this.storage.remove(storageKeys.friendInvitations);
    await this.storage.remove(storageKeys.meetingInvitations);

    this.store.dispatch(new ClearState());
    await this.storage.remove(storageKeys.lastRequestForm);
    await this.storage.remove(storageKeys.lastMeetingForm);
    await this.storage.remove(storageKeys.lastExploreLocation);
    await this.storage.remove(storageKeys.restricted);
  }

  private getToken(): Promise<TokenDto> {
    return this.sessionService.getSession();
  }

  private async getRefreshToken(): Promise<string> {
    const session = await this.getToken();
    return session ? session.refreshToken : null;
  }
}
