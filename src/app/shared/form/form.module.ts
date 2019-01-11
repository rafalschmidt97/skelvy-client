import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextareaComponent } from './textarea/textarea.component';
import { DynamicHeightDirective } from './textarea/dynamic-height.directive';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule } from 'primeng/primeng';
import { ModalModule } from '../modal/modal.module';

@NgModule({
  declarations: [
    FormComponent,
    InputComponent,
    TextareaComponent,
    DynamicHeightDirective,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    CalendarModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormComponent,
    InputComponent,
    TextareaComponent,
    CalendarComponent,
  ],
})
export class FormModule {}
