import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditPage } from './edit.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [EditPage],
})
export class EditMeetingPageModule {}
