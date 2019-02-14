import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { Iframe } from '../../../shared/iframe/iframe';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../../core/auth/auth.service';
import { NavController } from '@ionic/angular';
import { SessionService } from '../../../core/auth/session.service';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { LoadingService } from '../../../core/loading/loading.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  iframe: Iframe;
  @ViewChild('iframe') iframeTemplate: TemplateRef<any>;
  url: string;
  title: string;
  loggedInChecked = false;

  constructor(
    private readonly iframeService: IframeService,
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
    private readonly storage: Storage,
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.sessionService.isAuthenticated().then(authenticated => {
      if (authenticated) {
        this.routerNavigation.navigateForward(['/app']).catch(() => {
          this.loggedInChecked = true;
        });
      } else {
        this.loggedInChecked = true;
      }
    });
  }

  show(url: string, title = '') {
    this.url = url;
    this.title = title;

    this.iframe = this.iframeService.show(this.iframeTemplate);
  }

  decline() {
    this.iframe.hide();
  }

  async signInWithFacebook() {
    this.facebook
      .login(['public_profile', 'email', 'user_birthday', 'user_gender'])
      .then(async (res: FacebookLoginResponse) => {
        if (res.status === 'connected') {
          const token = res.authResponse.accessToken;

          const loading = await this.loadingService.show();
          this.authService.signInWithFacebook(token).subscribe(
            async () => {
              this.routerNavigation.navigateForward(['/app']);
              await loading.dismiss();
            },
            async () => {
              this.toastService.createError(_('Something went wrong'));
              await loading.dismiss();
            },
          );
        } else {
          this.toastService.createError(_('Something went wrong'));
        }
      });
  }

  signInWithGoogle() {
    this.google.login({}).then(async res => {
      const token = res.accessToken;

      const loading = await this.loadingService.show();
      this.authService.signInWithGoogle(token).subscribe(
        async () => {
          this.routerNavigation.navigateForward(['/app']);
          await loading.dismiss();
        },
        async () => {
          this.toastService.createError(_('Something went wrong'));
          await loading.dismiss();
        },
      );
    });
  }
}
