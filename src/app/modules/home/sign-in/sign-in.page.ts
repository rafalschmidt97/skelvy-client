import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../../../core/auth/auth.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { LoadingService } from '../../../core/loading/loading.service';
import { UserPushService } from '../../user/user-push.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  @ViewChild('links') details: TemplateRef<any>;
  modal: Modal;

  constructor(
    private readonly facebook: Facebook,
    private readonly google: GooglePlus,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly userPush: UserPushService,
    private readonly translateService: TranslateService,
    private readonly storage: Storage,
    private readonly browser: InAppBrowser,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.userPush.initialize();
  }

  openLink(url: string) {
    this.browser.create(url, '_system');
  }

  open() {
    this.modal = this.modalService.show(this.details);
  }

  confirm() {
    this.modal.hide();
  }

  async signInWithFacebook() {
    this.facebook
      .login(['public_profile', 'email', 'user_birthday', 'user_gender'])
      .then(async (res: FacebookLoginResponse) => {
        if (res.status === 'connected') {
          const token = res.authResponse.accessToken;

          const loading = await this.loadingService.show();
          this.authService
            .signInWithFacebook(token, this.translateService.currentLang)
            .subscribe(
              async auth => {
                await this.storage.set('signInMethod', 'facebook');

                if (auth.accountCreated) {
                  this.routerNavigation.navigateForward([
                    '/app/user/edit',
                    { created: true },
                  ]);
                } else {
                  this.routerNavigation.navigateForward(['/app']);
                }

                await loading.dismiss();
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
      this.authService
        .signInWithGoogle(token, this.translateService.currentLang)
        .subscribe(
          async auth => {
            await this.storage.set('signInMethod', 'google');

            if (auth.accountCreated) {
              this.routerNavigation.navigateForward([
                '/app/user/edit',
                { created: true },
              ]);
            } else {
              this.routerNavigation.navigateForward(['/app']);
            }

            await loading.dismiss();
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
}
