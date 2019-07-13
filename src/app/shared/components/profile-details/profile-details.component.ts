import { Component, Input } from '@angular/core';
import { UserDto } from '../../../modules/user/user';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ToastService } from '../../../core/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../modules/settings/settings.service';
import { _ } from '../../../core/i18n/translate';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  @Input() user: UserDto;
  @Input() mine: boolean;
  @Input() blocked: boolean;
  loadingBlocking = false;

  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
    private readonly settingsService: SettingsService,
    private readonly translateService: TranslateService,
  ) {}

  blockUser() {
    this.loadingBlocking = true;
    this.settingsService.addBlockedUser(this.user).subscribe(
      () => {
        this.blocked = true;
        this.loadingBlocking = false;
      },
      () => {
        this.blocked = true;
        this.loadingBlocking = false;
      },
    );
  }

  removeBlockUser() {
    this.loadingBlocking = true;
    this.settingsService.removeBlockedUser(this.user.id).subscribe(
      () => {
        this.blocked = false;
        this.loadingBlocking = false;
      },
      () => {
        this.blocked = false;
        this.loadingBlocking = false;
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
}
