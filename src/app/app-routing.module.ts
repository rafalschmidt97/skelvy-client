import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { SelfResolver } from './modules/user/self.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: './modules/home/home.module#HomeModule',
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
        loadChildren: './modules/tabs/tabs.module#TabsModule',
      },
      {
        path: 'user',
        loadChildren: './modules/user/user.module#UserModule',
      },
      {
        path: 'meetings',
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
      { path: '', redirectTo: 'tabs/meetings', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
