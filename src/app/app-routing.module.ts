import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { SelfResolver } from './modules/user/self.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    resolve: {
      self: SelfResolver,
    },
    children: [
      {
        path: 'tabs',
        loadChildren: () =>
          import('./modules/tabs/tabs.module').then(m => m.TabsModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./modules/user/user.module').then(m => m.UserModule),
      },
      {
        path: 'meetings',
        loadChildren: () =>
          import('./modules/meetings/meetings.module').then(
            m => m.MeetingsModule,
          ),
      },
      {
        path: 'explore',
        loadChildren: () =>
          import('./modules/explore/explore.module').then(m => m.ExploreModule),
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('./modules/groups/groups.module').then(m => m.GroupsModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then(
            m => m.SettingsModule,
          ),
      },
      { path: '', redirectTo: 'tabs/meetings', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
