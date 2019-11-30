import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPage } from './add.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AddPage],
})
export class AddPageModule {}
