import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, IonicModule, TranslateModule, RouterModule],
  exports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    AlertComponent,
  ],
})
export class SharedModule {}
