import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/user', pathMatch: 'full' },
  {
    path: 'edit',
    loadChildren: () =>
      import('./edit/edit-profile.module').then(m => m.EditProfilePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
