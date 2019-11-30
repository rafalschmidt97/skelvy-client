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
        loadChildren: '../explore/overview/overview.module#OverviewPageModule',
      },
      {
        path: 'groups',
        loadChildren: '../groups/overview/overview.module#OverviewPageModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
