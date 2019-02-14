import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, TranslateModule, IonicModule],
  exports: [AlertComponent],
})
export class AlertModule {}
