import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInPage } from './sign-in.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SignInPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [SignInPage],
})
export class SignInPageModule {}
