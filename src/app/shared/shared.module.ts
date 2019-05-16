import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertModule } from './alert/alert.module';
import { ModalModule } from './modal/modal.module';
import { FormModule } from './form/form.module';
import { AgePipe } from './pipes/age.pipe';
import { ConnectionComponent } from './components/connection/connection.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    AlertModule,
    ModalModule,
    FormModule,
  ],
  declarations: [AgePipe, ConnectionComponent],
  exports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule,
    AlertModule,
    ModalModule,
    FormModule,
    AgePipe,
    ConnectionComponent,
  ],
})
export class SharedModule {}
