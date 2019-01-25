import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/tabs/more', pathMatch: 'full' },
  { path: 'legal', loadChildren: './legal/legal.module#LegalPageModule' },
  {
    path: 'community',
    loadChildren: './community/community.module#CommunityPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
