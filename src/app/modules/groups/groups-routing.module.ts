import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/groups', pathMatch: 'full' },
  {
    path: ':id/chat',
    loadChildren: () =>
      import('./chat/chat.module').then(m => m.ChatPageModule),
  },
  {
    path: 'edit',
    loadChildren: () =>
      import('./edit/edit-group.module').then(m => m.EditGroupPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
