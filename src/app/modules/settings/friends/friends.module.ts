import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FriendsPage } from './friends.page';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';
import { InvitationPreviewComponent } from './inviation-preview/invitation-preview.component';
import { FriendInvitationModalComponent } from './invitation-modal/invitation-modal.component';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    FriendsPage,
    ProfilePreviewComponent,
    InvitationPreviewComponent,
    FriendInvitationModalComponent,
  ],
  entryComponents: [FriendInvitationModalComponent],
})
export class FriendsPageModule {}
