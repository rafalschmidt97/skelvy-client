import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditPage } from './edit.page';
import { SharedModule } from '../../../shared/shared.module';
import { ImagesComponent } from './images/images.component';
import { ImageActionsModalComponent } from './images/image-actions-modal/image-actions-modal.component';

const routes: Routes = [
  {
    path: '',
    component: EditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [EditPage, ImageActionsModalComponent, ImagesComponent],
  entryComponents: [ImageActionsModalComponent],
})
export class EditProfilePageModule {}
