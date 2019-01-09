import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertComponent } from './alert/alert.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [AlertComponent, ModalComponent],
  imports: [CommonModule, IonicModule, TranslateModule, RouterModule],
  exports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    AlertComponent,
    ModalComponent,
  ],
})
export class SharedModule {}
