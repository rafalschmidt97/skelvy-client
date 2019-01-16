import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewPage } from './overview.page';
import { SharedModule } from '../../../shared/shared.module';
import { UnspecifiedComponent } from './unspecified/unspecified.component';
import { SearchingComponent } from './searching/searching.component';
import { FoundComponent } from './found/found.component';
import { ProfileDetailsComponent } from './found/profile-details/profile-details.component';

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
    UnspecifiedComponent,
    SearchingComponent,
    FoundComponent,
    ProfileDetailsComponent,
  ],
})
export class OverviewPageModule {}
