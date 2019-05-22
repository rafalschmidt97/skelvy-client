import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from '../../../../core/toast/toast.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { UserDto } from '../../../user/user';
import { _ } from '../../../../core/i18n/translate';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  @Input() user: UserDto;
  @Output() removeBlockedUser = new EventEmitter();

  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
  ) {}

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
