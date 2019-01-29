import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Iframe } from '../../../shared/iframe/iframe';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

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
    this.emailComposer.open({
      to: 'rafalschmidt97@gmail.com',
      subject: '[skelvy] Feedback',
    });
  }
}
