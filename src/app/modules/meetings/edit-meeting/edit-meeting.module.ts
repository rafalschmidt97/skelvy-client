import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { EditMeetingPage } from './edit-meeting.page';

const routes: Routes = [
  {
    path: '',
    component: EditMeetingPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [EditMeetingPage],
})
export class EditMeetingPageModule {}
