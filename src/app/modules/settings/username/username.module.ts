import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsernamePage } from './username.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: UsernamePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [UsernamePage],
})
export class UsernamePageModule {}
