import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../../../core/auth/auth.service';
import { ModalController, NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { LoadingService } from '../../../core/loading/loading.service';
import { UserPushService } from '../../user/user-push.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { LegalLinksModalComponent } from './legal-links-modal/legal-links-modal.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
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
    private readonly modalController: ModalController,
  ) {}

  async ngOnInit() {
    await this.userPush.initialize();
  }

  async openLinks() {
    const modal = await this.modalController.create({
      component: LegalLinksModalComponent,
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
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
                  _(
                    'A problem occurred while signing in with facebook. Please contact us.',
                  ),
                );
                await loading.dismiss();
              },
            );
        } else {
          this.toastService.createError(
            _(
              'A problem occurred while signing in with facebook (not connected). Please contact us.',
            ),
          );
        }
      })
      .catch(e => {
        if (e.errorCode !== '4201' && e !== 'User cancelled.') {
          // not cancelled
          console.log(e);
          this.toastService.createError(
            _(
              'A problem occurred while signing in with facebook (plugin problem). Please contact us.',
            ),
          );
        }
      });
  }

  signInWithGoogle() {
    this.google
      .login({})
      .then(async res => {
        const token = res.accessToken;

        const loading = await this.loadingService.show();
        this.authService
          .signInWithGoogle(token, this.translateService.currentLang)
          .subscribe(
            async auth => {
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
                _('A problem occurred while signing in with google'),
              );
              await loading.dismiss();
            },
          );
      })
      .catch(e => {
        if (e !== 12501 && e !== 'The user canceled the sign-in flow.') {
          // not cancelled
          console.log(e);
          this.toastService.createError(
            _(
              'A problem occurred while signing in with google (plugin problem). Please contact us.',
            ),
          );
        }
      });
  }
}
