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
import { MeetingSuggestionsComponent } from './components/meeting-suggestions/meeting-suggestions.component';
import { RequestSuggestionsModalComponent } from './components/meeting-suggestions/request-suggestions-modal/request-suggestions-modal.component';
import { MeetingSuggestionsModalComponent } from './components/meeting-suggestions/meeting-suggestions-modal/meeting-suggestions-modal.component';
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
  declarations: [
    AgePipe,
    ConnectionComponent,
    MeetingSuggestionsComponent,
    MeetingSuggestionsModalComponent,
    RequestSuggestionsModalComponent,
    ProfileDetailsModalComponent,
  ],
  entryComponents: [
    MeetingSuggestionsModalComponent,
    RequestSuggestionsModalComponent,
    ProfileDetailsModalComponent,
  ],
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
    MeetingSuggestionsComponent,
    ProfileDetailsModalComponent,
  ],
})
export class SharedModule {}
