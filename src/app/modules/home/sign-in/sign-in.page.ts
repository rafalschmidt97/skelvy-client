import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from '../../../core/auth/auth.service';
import { ModalController, NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';
import { LoadingService } from '../../../core/loading/loading.service';
import { UserPushService } from '../../user/user-push.service';
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
          this.authService.signInWithFacebook(token).subscribe(
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
                  'A problem occurred while signing in with Facebook. Please contact us.',
                ),
              );

              try {
                await this.facebook.logout();
              } catch (e) {}

              await loading.dismiss();
            },
          );
        } else {
          this.toastService.createError(
            _(
              'A problem occurred while signing in with Facebook (not connected). Please contact us.',
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
              'A problem occurred while signing in with Facebook (plugin problem). Please contact us.',
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
        this.authService.signInWithGoogle(token).subscribe(
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
                'A problem occurred while signing in with Google. Please contact us.',
              ),
            );

            try {
              await this.google.logout();
            } catch (e) {}

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
              'A problem occurred while signing in with Google (plugin problem). Please contact us.',
            ),
          );
        }
      });
  }
}
