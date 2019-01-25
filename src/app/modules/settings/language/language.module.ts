import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LanguagePage } from './language.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LanguagePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [LanguagePage],
})
export class LanguagePageModule {}
