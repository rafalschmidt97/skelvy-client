import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/explore', pathMatch: 'full' },
  {
    path: 'add',
    loadChildren: './add/add.module#AddPageModule',
  },
  {
    path: 'connect/:id',
    loadChildren: './connect/connect.module#ConnectPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExploreRoutingModule {}
