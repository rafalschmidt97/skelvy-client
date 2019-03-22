import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'profile',
        loadChildren: '../profile/overview/overview.module#OverviewPageModule',
      },
      {
        path: 'meeting',
        loadChildren: '../meeting/overview/overview.module#OverviewPageModule',
      },
      {
        path: 'more',
        loadChildren: '../settings/overview/overview.module#OverviewPageModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
