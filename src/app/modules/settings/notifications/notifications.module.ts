import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationsPage } from './notifications.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [NotificationsPage],
})
export class NotificationsPageModule {}
