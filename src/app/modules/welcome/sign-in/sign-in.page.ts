import { Component, TemplateRef, ViewChild } from '@angular/core';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { Iframe } from '../../../shared/iframe/iframe';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { from, Observable } from 'rxjs';
import { SessionService } from '../../../core/auth/session.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  iframe: Iframe;
  @ViewChild('iframe') iframeTemplate: TemplateRef<any>;
  url: string;
  title: string;
  loggedIn: Observable<boolean>;

  constructor(
    private readonly iframeService: IframeService,
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
    private readonly storage: Storage,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly routerNavigation: NavController,
  ) {
    this.loggedIn = from(this.sessionService.isAuthenticated()).pipe(
      tap(authenticated => {
        if (authenticated) {
          this.routerNavigation.navigateRoot(['/app']);
        }
      }),
    );
  }

  show(url: string, title = '') {
    this.url = url;
    this.title = title;

    this.iframe = this.iframeService.show(this.iframeTemplate);
  }

  decline() {
    this.iframe.hide();
  }

  signInWithFacebook() {
    this.facebook
      .login(['public_profile', 'email', 'user_birthday', 'user_gender'])
      .then((res: FacebookLoginResponse) => {
        if (res.status === 'connected') {
          const token = res.authResponse.accessToken;

          this.authService.signInWithFacebook(token).subscribe(
            () => {
              this.routerNavigation.navigateForward(['/app']);
            },
            (err: HttpErrorResponse) => {
              if (err.status === 401) {
                console.log('The email and password you entered did not match');
              } else {
                console.log('Something went wrong');
              }
            },
          );
        } else {
          console.log('Error logging into Facebook', res.status);
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  signInWithGoogle() {
    this.google
      .login({})
      .then(res => {
        const token = res.accessToken;

        this.authService.signInWithGoogle(token).subscribe(
          () => {
            this.routerNavigation.navigateForward(['/app']);
          },
          (err: HttpErrorResponse) => {
            if (err.status === 401) {
              console.log('The email and password you entered did not match');
            } else {
              console.log('Something went wrong');
            }
          },
        );
      })
      .catch(e => console.log('Error logging into Google', e));
  }
}
