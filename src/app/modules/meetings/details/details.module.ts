import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsPage } from './details.page';
import { SharedModule } from '../../../shared/shared.module';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';
import { ProfileMissingComponent } from './profile-missing/profile-missing.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [DetailsPage, ProfilePreviewComponent, ProfileMissingComponent],
})
export class DetailsPageModule {}
