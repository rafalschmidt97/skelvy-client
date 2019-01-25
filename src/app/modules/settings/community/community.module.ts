import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommunityPage } from './community.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CommunityPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CommunityPage],
})
export class CommunityPageModule {}
