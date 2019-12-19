import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewPage } from './overview.page';
import { SharedModule } from '../../../shared/shared.module';
import { MeetingInvitationPreviewComponent } from './inviation-preview/meeting-invitation-preview.component';
import { MeetingInvitationModalComponent } from './invitation-modal/meeting-invitation-modal.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    OverviewPage,
    MeetingInvitationModalComponent,
    MeetingInvitationPreviewComponent,
  ],
  entryComponents: [MeetingInvitationModalComponent],
})
export class OverviewPageModule {}
