import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Iframe } from '../../../shared/iframe/iframe';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage {
  iframe: Iframe;
  @ViewChild('iframe') iframeTemplate: TemplateRef<any>;

  url: string;
  title: string;

  constructor(
    private readonly iframeService: IframeService,
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
  ) {}

  show(url: string, title = '') {
    this.url = url;
    this.title = title;

    this.iframe = this.iframeService.show(this.iframeTemplate);
  }

  decline() {
    this.iframe.hide();
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
          0,
        );
      });
  }
}
