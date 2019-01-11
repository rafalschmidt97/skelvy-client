import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from './safe-url.pipe';
import { IframeComponent } from './iframe.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeUrlPipe, IframeComponent],
  imports: [CommonModule, TranslateModule],
  exports: [IframeComponent],
})
export class IframeModule {}
