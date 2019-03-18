import { Component, TemplateRef, ViewChild } from '@angular/core';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { Iframe } from '../../../shared/iframe/iframe';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../../../core/auth/auth.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { LoadingService } from '../../../core/loading/loading.service';
import { Push } from '@ionic-native/push/ngx';
import { UserService } from '../../profile/user.service';

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

  constructor(
    private readonly iframeService: IframeService,
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly push: Push,
    private readonly userService: UserService,
  ) {}

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
              this.registerDevice();
            },
            async () => {
              this.toastService.createError(
                _('A problem occurred while signing in'),
              );
              await loading.dismiss();
            },
          );
        } else {
          this.toastService.createError(
            _('A problem occurred while signing in'),
          );
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
          this.registerDevice();
        },
        async () => {
          this.toastService.createError(
            _('A problem occurred while signing in'),
          );
          await loading.dismiss();
        },
      );
    });
  }

  private registerDevice() {
    this.push.hasPermission();

    this.push.createChannel({
      id: 'push',
      description: 'Push Channel',
      importance: 3,
    });

    const pushListener = this.push.init({
      android: {
        topics: ['all'],
      },
      ios: {
        alert: true,
        badge: true,
        sound: true,
        topics: ['all'],
      },
    });

    pushListener.on('registration').subscribe((registration: any) => {
      console.log(registration.registrationId);
      this.userService.assignDevice(registration.registrationId).subscribe(
        () => {
          // TODO: save topic subscription to storage for check on notifications
          // TODO: save registration id for check on notifications
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while assigning the device'),
          );
        },
      );
    });

    pushListener.on('error').subscribe(() => {
      this.toastService.createError(
        _('A problem occurred while registering the device'),
      );
    });
  }
}
