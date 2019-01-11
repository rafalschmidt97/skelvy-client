import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, TranslateModule],
  exports: [ModalComponent],
})
export class ModalModule {}
