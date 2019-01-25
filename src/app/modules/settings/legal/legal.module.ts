import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalPage } from './legal.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LegalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [LegalPage],
})
export class LegalPageModule {}
