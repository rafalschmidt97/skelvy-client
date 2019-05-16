import { Component } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage {
  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
    private readonly browser: InAppBrowser,
  ) {}

  openLink(url: string) {
    this.browser.create(url, '_system');
  }

  sendFeedback() {
    this.emailComposer
      .open({
        to: 'contact.skelvy@gmail.com',
        subject: '[skelvy] Feedback',
      })
      .then(() => {
        this.toastService.createInformation(
          _(
            `If you have any further questions, don't hesitate to contact us by using our website`,
          ),
          10000,
        );
      });
  }
}
