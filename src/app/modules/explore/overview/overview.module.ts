import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewPage } from './overview.page';
import { SharedModule } from '../../../shared/shared.module';
import { MeetingSuggestionsModalComponent } from './meeting/meeting-suggestions-modal.component';
import { RequestSuggestionsModalComponent } from './request/request-suggestions-modal.component';

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
    MeetingSuggestionsModalComponent,
    RequestSuggestionsModalComponent,
  ],
  entryComponents: [
    MeetingSuggestionsModalComponent,
    RequestSuggestionsModalComponent,
  ],
})
export class OverviewPageModule {}
