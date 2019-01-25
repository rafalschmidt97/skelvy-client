import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Iframe } from '../../../shared/iframe/iframe';
import { IframeService } from '../../../shared/iframe/iframe.service';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
})
export class LegalPage {
  iframe: Iframe;
  @ViewChild('iframe') iframeTemplate: TemplateRef<any>;

  url: string;
  title: string;

  constructor(private readonly iframeService: IframeService) {}

  show(url: string, title = '') {
    this.url = url;
    this.title = title;

    this.iframe = this.iframeService.show(this.iframeTemplate);
  }

  decline() {
    this.iframe.hide();
  }
}
