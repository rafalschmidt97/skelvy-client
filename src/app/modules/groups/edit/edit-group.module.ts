import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { EditGroupPage } from './edit-group.page';

const routes: Routes = [
  {
    path: '',
    component: EditGroupPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [EditGroupPage],
})
export class EditGroupPageModule {}
