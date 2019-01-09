import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertComponent } from './alert/alert.component';
import { ModalComponent } from './modal/modal.component';
import { IframeComponent } from './iframe/iframe.component';
import { SafeUrlPipe } from './iframe/safe-url.pipe';

@NgModule({
  declarations: [AlertComponent, ModalComponent, SafeUrlPipe, IframeComponent],
  imports: [CommonModule, IonicModule, TranslateModule, RouterModule],
  exports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    AlertComponent,
    ModalComponent,
    IframeComponent,
  ],
})
export class SharedModule {}
