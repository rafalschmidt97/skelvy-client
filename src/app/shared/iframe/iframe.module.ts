import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from './safe-url.pipe';
import { IframeComponent } from './iframe.component';

@NgModule({
  declarations: [SafeUrlPipe, IframeComponent],
  imports: [CommonModule],
  exports: [IframeComponent],
})
export class IframeModule {}
