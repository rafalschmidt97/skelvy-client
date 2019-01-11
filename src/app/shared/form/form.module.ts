import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextareaComponent } from './textarea/textarea.component';
import { DynamicHeightDirective } from './textarea/dynamic-height.directive';

@NgModule({
  declarations: [
    FormComponent,
    InputComponent,
    TextareaComponent,
    DynamicHeightDirective,
  ],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  exports: [
    ReactiveFormsModule,
    FormComponent,
    InputComponent,
    TextareaComponent,
  ],
})
export class FormModule {}
