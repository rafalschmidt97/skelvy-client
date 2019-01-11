import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextareaComponent } from './textarea/textarea.component';
import { DynamicHeightDirective } from './textarea/dynamic-height.directive';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, SliderModule } from 'primeng/primeng';
import { ModalModule } from '../modal/modal.module';
import { DateComponent } from './date/date.component';
import { IonicModule } from '@ionic/angular';
import { RangeComponent } from './range/range.component';

@NgModule({
  declarations: [
    FormComponent,
    InputComponent,
    TextareaComponent,
    DynamicHeightDirective,
    CalendarComponent,
    DateComponent,
    RangeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    CalendarModule,
    IonicModule,
    SliderModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormComponent,
    InputComponent,
    TextareaComponent,
    CalendarComponent,
    DateComponent,
    RangeComponent,
  ],
})
export class FormModule {}
