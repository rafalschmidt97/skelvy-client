import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditPage } from './edit.page';
import { SharedModule } from '../../../shared/shared.module';
import { AddressComponent } from './address/address.component';
import { AutofocusDirective } from './address/autofocus.directive';

const routes: Routes = [
  {
    path: '',
    component: EditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [EditPage, AddressComponent, AutofocusDirective],
})
export class EditMeetingPageModule {}
