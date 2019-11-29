import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertModule } from './components/alert/alert.module';
import { FormModule } from './form/form.module';
import { AgePipe } from './pipes/age.pipe';
import { ConnectionComponent } from './components/connection/connection.component';
import { ProfileDetailsModalComponent } from './components/profile-details-modal/profile-details-modal.component';
import { ModalModule } from './components/modal/modal.module';

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
  declarations: [AgePipe, ConnectionComponent, ProfileDetailsModalComponent],
  entryComponents: [ProfileDetailsModalComponent],
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
    ProfileDetailsModalComponent,
  ],
})
export class SharedModule {}
