import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FormComponent, InputComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  exports: [ReactiveFormsModule, FormComponent, InputComponent],
})
export class FormModule {}
