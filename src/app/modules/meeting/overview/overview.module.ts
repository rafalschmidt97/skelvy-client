import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewPage } from './overview.page';
import { SharedModule } from '../../../shared/shared.module';
import { UnspecifiedComponent } from './unspecified/unspecified.component';
import { SearchingComponent } from './searching/searching.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [OverviewPage, UnspecifiedComponent, SearchingComponent],
})
export class OverviewPageModule {}
