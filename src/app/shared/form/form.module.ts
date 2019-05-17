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
import { SelectComponent } from './select/select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioComponent } from './radio/radio.component';
import { SwitchComponent } from './switch/switch.component';

@NgModule({
  declarations: [
    FormComponent,
    InputComponent,
    TextareaComponent,
    DynamicHeightDirective,
    CalendarComponent,
    DateComponent,
    RangeComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    SwitchComponent,
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
    FormsModule,
    ReactiveFormsModule,
    FormComponent,
    InputComponent,
    TextareaComponent,
    DynamicHeightDirective,
    CalendarComponent,
    DateComponent,
    RangeComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    SwitchComponent,
  ],
})
export class FormModule {}
