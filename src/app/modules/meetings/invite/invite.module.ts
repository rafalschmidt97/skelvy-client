import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { InvitePage } from './invite.page';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';

const routes: Routes = [
  {
    path: '',
    component: InvitePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [InvitePage, ProfilePreviewComponent],
})
export class InvitePageModule {}
