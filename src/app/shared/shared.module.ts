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
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';

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
  declarations: [AgePipe, ConnectionComponent, ProfileDetailsComponent],
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
    ProfileDetailsComponent,
  ],
})
export class SharedModule {}
