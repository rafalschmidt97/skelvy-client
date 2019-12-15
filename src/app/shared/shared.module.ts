import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertModule } from './components/alert/alert.module';
import { FormModule } from './form/form.module';
import { AgePipe } from './pipes/age.pipe';
import { ConnectionComponent } from './components/connection/connection.component';
import { ModalModule } from './components/modal/modal.module';
import { ProfileModalComponent } from './components/modal/profile/profile-modal.component';
import { GroupProfileModalComponent } from './components/modal/group-profile/group-profile-modal.component';

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
  declarations: [
    AgePipe,
    ConnectionComponent,
    ProfileModalComponent,
    GroupProfileModalComponent,
  ],
  entryComponents: [ProfileModalComponent, GroupProfileModalComponent],
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
    ProfileModalComponent,
    GroupProfileModalComponent,
  ],
})
export class SharedModule {}
