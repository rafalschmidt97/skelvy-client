import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorePage } from './explore.page';
import { SharedModule } from '../../../shared/shared.module';
import { MeetingSuggestionsModalComponent } from './meeting/meeting-suggestions-modal.component';
import { RequestSuggestionsModalComponent } from './request/request-suggestions-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ExplorePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    ExplorePage,
    MeetingSuggestionsModalComponent,
    RequestSuggestionsModalComponent,
  ],
  entryComponents: [
    MeetingSuggestionsModalComponent,
    RequestSuggestionsModalComponent,
  ],
})
export class ExplorePageModule {}
