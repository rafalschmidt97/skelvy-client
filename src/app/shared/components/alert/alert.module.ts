import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  declarations: [AlertComponent, AlertModalComponent],
  entryComponents: [AlertModalComponent],
  imports: [CommonModule, TranslateModule, IonicModule],
  exports: [AlertComponent, AlertModalComponent],
})
export class AlertModule {}
