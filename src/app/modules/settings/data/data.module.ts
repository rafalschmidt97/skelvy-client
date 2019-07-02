import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataPage } from './data.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DataPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [DataPage],
})
export class DataPageModule {}
