import { Component, Input } from '@angular/core';
import { _ } from '../../../../../core/i18n/translate';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ToastService } from '../../../../../core/toast/toast.service';
import { MeetingUserDto } from '../../../meeting';
import { UserService } from '../../../../user/user.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  @Input() user: MeetingUserDto;
  blocked = false;
  loadingBlocking = false;

  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
    private readonly userService: UserService,
  ) {}

  sendReport() {
    this.emailComposer
      .open({
        to: 'contact.skelvy@gmail.com',
        subject: `[skelvy] Report user#${this.user.id}`,
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

  blockUser() {
    this.loadingBlocking = true;
    this.userService.addBlockUser(this.user.id).subscribe(
      () => {
        this.blocked = true;
        this.loadingBlocking = false;
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while adding blocked user'),
        );
        this.loadingBlocking = false;
      },
    );
  }

  removeBlockUser() {
    this.loadingBlocking = true;
    this.userService.removeBlockedUser(this.user.id).subscribe(
      () => {
        this.blocked = false;
        this.loadingBlocking = false;
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while removing blocked user'),
        );
        this.loadingBlocking = false;
      },
    );
  }
}
