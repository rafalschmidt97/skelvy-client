import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewPage } from './overview.page';
import { SharedModule } from '../../../shared/shared.module';
import { UnspecifiedComponent } from './unspecified/unspecified.component';
import { SearchingComponent } from './searching/searching.component';
import { FoundComponent } from './found/found.component';
import { ProfileLoadingComponent } from './found/profile-loading/profile-loading.component';
import { SuggestionsComponent } from './searching/suggestions/suggestions.component';
import { ProfileMissingComponent } from './found/profile-missing/profile-missing.component';
import { ProfilePreviewComponent } from './found/profile-preview/profile-preview.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    OverviewPage,
    UnspecifiedComponent,
    SearchingComponent,
    SuggestionsComponent,
    FoundComponent,
    ProfilePreviewComponent,
    ProfileLoadingComponent,
    ProfileMissingComponent,
  ],
})
export class OverviewPageModule {}
