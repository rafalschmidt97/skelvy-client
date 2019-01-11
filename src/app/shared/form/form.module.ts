import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextareaComponent } from './textarea/textarea.component';
import { DynamicHeightDirective } from './textarea/dynamic-height.directive';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule } from 'primeng/primeng';
import { ModalModule } from '../modal/modal.module';
import { DateComponent } from './date/date.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    FormComponent,
    InputComponent,
    TextareaComponent,
    DynamicHeightDirective,
    CalendarComponent,
    DateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    CalendarModule,
    IonicModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormComponent,
    InputComponent,
    TextareaComponent,
    CalendarComponent,
    DateComponent,
  ],
})
export class FormModule {}
