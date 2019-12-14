import { Component, Input } from '@angular/core';
import { UserDto } from '../../../modules/user/user';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ToastService } from '../../../core/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../modules/settings/settings.service';
import { _ } from '../../../core/i18n/translate';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile-details-modal',
  templateUrl: './profile-details-modal.component.html',
  styleUrls: ['./profile-details-modal.component.scss'],
})
export class ProfileDetailsModalComponent {
  @Input() user: UserDto;
  @Input() mine: boolean;
  @Input() blocked: boolean;
  @Input() friend: boolean;
  loadingFriend = false;
  loadingBlocked = false;

  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
    private readonly settingsService: SettingsService,
    private readonly translateService: TranslateService,
    private readonly modalController: ModalController,
  ) {}

  blockUser() {
    this.loadingBlocked = true;
    this.settingsService.addBlockedUser(this.user).subscribe(
      () => {
        this.blocked = true;
        this.loadingBlocked = false;
      },
      () => {
        this.blocked = true;
        this.loadingBlocked = false;
      },
    );
  }

  removeBlockUser() {
    this.loadingBlocked = true;
    this.settingsService.removeBlockedUser(this.user.id).subscribe(
      () => {
        this.blocked = false;
        this.loadingBlocked = false;
      },
      () => {
        this.blocked = false;
        this.loadingBlocked = false;
      },
    );
  }

  inviteFriend() {
    this.loadingFriend = true;
    this.settingsService.inviteFriend(this.user.id).subscribe(
      () => {
        this.blocked = true;
        this.loadingFriend = false;
      },
      () => {
        this.blocked = true;
        this.loadingFriend = false;
      },
    );
  }

  removeFriend() {
    this.loadingFriend = true;
    this.settingsService.removeFriend(this.user.id).subscribe(
      () => {
        this.friend = false;
        this.loadingFriend = false;
      },
      () => {
        this.friend = false;
        this.loadingFriend = false;
      },
    );
  }

  async sendReport() {
    const subject = await this.translateService
      .get(_('Report user'))
      .toPromise();

    this.emailComposer
      .open({
        to: 'contact.skelvy@gmail.com',
        subject: `[Skelvy] ${subject}#${this.user.id}`,
      })
      .then(() => {
        this.toastService.createInformation(
          _(
            `If you have any further problems, don't hesitate to contact us by using our website`,
          ),
          10000,
        );
      });
  }

  confirm() {
    this.modalController.dismiss();
  }
}
