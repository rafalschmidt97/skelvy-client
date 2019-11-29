import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/meetings', pathMatch: 'full' },
  {
    path: 'add',
    loadChildren: './add/add.module#AddPageModule',
  },
  {
    path: 'details/:id',
    loadChildren: './details/details.module#DetailsPageModule',
  },
  {
    path: 'edit-preferences',
    loadChildren:
      './edit-preferences/edit-preferences.module#EditPreferencesPageModule',
  },
  {
    path: 'edit-meeting',
    loadChildren: './edit-meeting/edit-meeting.module#EditMeetingPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingsRoutingModule {}
