import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/explore', pathMatch: 'full' },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then(m => m.AddPageModule),
  },
  {
    path: 'connect/:id',
    loadChildren: () =>
      import('./connect/connect.module').then(m => m.ConnectPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExploreRoutingModule {}
