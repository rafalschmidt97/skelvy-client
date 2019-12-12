import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: './overview/overview.module#OverviewPageModule',
  },
  { path: 'legal', loadChildren: './legal/legal.module#LegalPageModule' },
  {
    path: 'blocked',
    loadChildren: './blocked/blocked.module#BlockedPageModule',
  },
  {
    path: 'community',
    loadChildren: './community/community.module#CommunityPageModule',
  },
  {
    path: 'language',
    loadChildren: './language/language.module#LanguagePageModule',
  },
  {
    path: 'email',
    loadChildren: './email/email.module#EmailPageModule',
  },
  {
    path: 'username',
    loadChildren: './username/username.module#UsernamePageModule',
  },
  {
    path: 'notifications',
    loadChildren:
      './notifications/notifications.module#NotificationsPageModule',
  },
  {
    path: 'data',
    loadChildren: './data/data.module#DataPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
