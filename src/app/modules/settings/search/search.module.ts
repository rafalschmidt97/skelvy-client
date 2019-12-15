import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { SearchPage } from './search.page';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [SearchPage, ProfilePreviewComponent],
})
export class SearchPageModule {}
