import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/meetings', pathMatch: 'full' },
  {
    path: 'details/:id',
    loadChildren: () =>
      import('./details/details.module').then(m => m.DetailsPageModule),
  },
  {
    path: 'edit-preferences',
    loadChildren: () =>
      import('./edit-preferences/edit-preferences.module').then(
        m => m.EditPreferencesPageModule,
      ),
  },
  {
    path: 'edit-meeting',
    loadChildren: () =>
      import('./edit-meeting/edit-meeting.module').then(
        m => m.EditMeetingPageModule,
      ),
  },
  {
    path: 'invite',
    loadChildren: () =>
      import('./invite/invite.module').then(m => m.InvitePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingsRoutingModule {}
