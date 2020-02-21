import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./overview/overview.module').then(m => m.OverviewPageModule),
  },
  {
    path: 'legal',
    loadChildren: () =>
      import('./legal/legal.module').then(m => m.LegalPageModule),
  },
  {
    path: 'blocked',
    loadChildren: () =>
      import('./blocked/blocked.module').then(m => m.BlockedPageModule),
  },
  {
    path: 'friends',
    loadChildren: () =>
      import('./friends/friends.module').then(m => m.FriendsPageModule),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then(m => m.SearchPageModule),
  },
  {
    path: 'community',
    loadChildren: () =>
      import('./community/community.module').then(m => m.CommunityPageModule),
  },
  {
    path: 'language',
    loadChildren: () =>
      import('./language/language.module').then(m => m.LanguagePageModule),
  },
  {
    path: 'email',
    loadChildren: () =>
      import('./email/email.module').then(m => m.EmailPageModule),
  },
  {
    path: 'username',
    loadChildren: () =>
      import('./username/username.module').then(m => m.UsernamePageModule),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications/notifications.module').then(
        m => m.NotificationsPageModule,
      ),
  },
  {
    path: 'data',
    loadChildren: () =>
      import('./data/data.module').then(m => m.DataPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
