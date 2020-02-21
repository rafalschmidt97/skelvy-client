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
        loadChildren: () =>
          import('../user/overview/overview.module').then(
            m => m.OverviewPageModule,
          ),
      },
      {
        path: 'meetings',
        loadChildren: () =>
          import('../meetings/overview/overview.module').then(
            m => m.OverviewPageModule,
          ),
      },
      {
        path: 'explore',
        loadChildren: () =>
          import('../explore/overview/overview.module').then(
            m => m.OverviewPageModule,
          ),
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('../groups/overview/overview.module').then(
            m => m.OverviewPageModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
