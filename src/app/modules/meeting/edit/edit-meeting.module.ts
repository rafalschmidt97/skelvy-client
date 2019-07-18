import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditPage } from './edit.page';
import { SharedModule } from '../../../shared/shared.module';
import { AddressComponent } from './address/address.component';
import { AutofocusDirective } from './address/autofocus.directive';
import { AddressItemComponent } from './address/address-item/address-item.component';
import { AddressSearchModalComponent } from './address/address-search-modal/address-search-modal.component';

const routes: Routes = [
  {
    path: '',
    component: EditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    AddressSearchModalComponent,
    EditPage,
    AddressComponent,
    AutofocusDirective,
    AddressItemComponent,
  ],
  entryComponents: [AddressSearchModalComponent],
})
export class EditMeetingPageModule {}
