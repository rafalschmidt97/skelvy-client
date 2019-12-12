import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailPage } from './email.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EmailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [EmailPage],
})
export class EmailPageModule {}
