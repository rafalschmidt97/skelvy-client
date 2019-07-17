import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInPage } from './sign-in.page';
import { SharedModule } from '../../../shared/shared.module';
import { LegalLinksModalComponent } from './legal-links-modal/legal-links-modal.component';

const routes: Routes = [
  {
    path: '',
    component: SignInPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  entryComponents: [LegalLinksModalComponent],
  declarations: [LegalLinksModalComponent, SignInPage],
})
export class SignInPageModule {}
