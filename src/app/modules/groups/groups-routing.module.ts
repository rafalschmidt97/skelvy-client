import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/tabs/groups', pathMatch: 'full' },
  {
    path: ':id/chat',
    loadChildren: './chat/chat.module#ChatPageModule',
  },
  {
    path: 'edit',
    loadChildren: './edit/edit-group.module#EditGroupPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
