import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertModule } from './alert/alert.module';
import { IframeModule } from './iframe/iframe.module';
import { ModalModule } from './modal/modal.module';
import { FormModule } from './form/form.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    AlertModule,
    IframeModule,
    ModalModule,
    FormModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    AlertModule,
    IframeModule,
    ModalModule,
    FormModule,
  ],
})
export class SharedModule {}
