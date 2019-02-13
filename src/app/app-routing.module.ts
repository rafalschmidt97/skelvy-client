import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { UserResolver } from './modules/profile/user.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'welcome',
    loadChildren: './modules/welcome/welcome.module#WelcomeModule',
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    resolve: { user: UserResolver },
    children: [
      {
        path: 'tabs',
        loadChildren: './modules/tabs/tabs.module#TabsModule',
      },
      {
        path: 'profile',
        loadChildren: './modules/profile/profile.module#ProfileModule',
      },
      {
        path: 'meeting',
        loadChildren: './modules/meeting/meeting.module#MeetingModule',
      },
      {
        path: 'chat',
        loadChildren: './modules/chat/chat.module#ChatModule',
      },
      {
        path: 'settings',
        loadChildren: './modules/settings/settings.module#SettingsModule',
      },
      { path: '', redirectTo: 'tabs', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
