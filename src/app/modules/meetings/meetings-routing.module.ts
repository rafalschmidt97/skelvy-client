import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/meetings', pathMatch: 'full' },
  {
    path: 'add',
    loadChildren: './add/add.module#AddPageModule',
  },
  {
    path: 'edit-preferences',
    loadChildren:
      './edit-preferences/edit-preferences.module#EditPreferencesPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingsRoutingModule {}
