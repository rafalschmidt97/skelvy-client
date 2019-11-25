import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { EditPreferencesPage } from './edit-preferences.page';

const routes: Routes = [
  {
    path: '',
    component: EditPreferencesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [EditPreferencesPage],
})
export class EditPreferencesPageModule {}
