import { Component, TemplateRef } from '@angular/core';
import { IframeService } from '../../../shared/iframe/iframe.service';
import { Iframe } from '../../../shared/iframe/iframe';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  iframe: Iframe;

  constructor(private readonly iframeService: IframeService) {}
  
  showIframe(template: TemplateRef<any>) {
    this.iframe = this.iframeService.show(template);
  }

  declineIframe() {
    this.iframe.hide();
  }
}
