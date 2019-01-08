import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [CommonModule, IonicModule, TranslateModule, RouterModule],
  exports: [CommonModule, IonicModule, TranslateModule, RouterModule],
})
export class SharedModule {}
