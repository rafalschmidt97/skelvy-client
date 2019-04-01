import { Component, Input } from '@angular/core';
import { _ } from '../../../../../core/i18n/translate';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ToastService } from '../../../../../core/toast/toast.service';
import { MeetingUser } from '../../../meeting';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  @Input() user: MeetingUser;

  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
  ) {}

  sendReport() {
    this.emailComposer
      .open({
        to: 'rafalschmidt97@gmail.com',
        subject: `[skelvy] Report user#${this.user.id}`,
      })
      .then(() => {
        this.toastService.createInformation(
          _(
            `If you have any further problems, don't hesitate to contact us by using our website`,
          ),
          0,
        );
      });
  }
}
