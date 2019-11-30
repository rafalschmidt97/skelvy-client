import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ConnectPage } from './connect.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ConnectPage],
})
export class ConnectPageModule {}
