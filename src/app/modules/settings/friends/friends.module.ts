import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FriendsPage } from './friends.page';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [FriendsPage, ProfilePreviewComponent],
})
export class FriendsPageModule {}
