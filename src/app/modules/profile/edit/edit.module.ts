import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditPage } from './edit.page';
import { SharedModule } from '../../../shared/shared.module';
import { ImagesComponent } from './images/images.component';
import { ImageCropperModule } from 'ngx-image-cropper';

const routes: Routes = [
  {
    path: '',
    component: EditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule, ImageCropperModule],
  declarations: [EditPage, ImagesComponent],
})
export class EditPageModule {}
