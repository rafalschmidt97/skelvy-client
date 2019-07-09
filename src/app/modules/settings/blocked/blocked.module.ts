import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { BlockedPage } from './blocked.page';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';

const routes: Routes = [
  {
    path: '',
    component: BlockedPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [BlockedPage, ProfilePreviewComponent],
})
export class BlockedPageModule {}
