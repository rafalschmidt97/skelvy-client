import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'user',
        loadChildren: '../user/overview/overview.module#OverviewPageModule',
      },
      {
        path: 'meetings',
        loadChildren: '../meetings/overview/overview.module#OverviewPageModule',
      },
      {
        path: 'explore',
        loadChildren: '../meetings/explore/explore.module#ExplorePageModule',
      },
      {
        path: 'settings',
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
