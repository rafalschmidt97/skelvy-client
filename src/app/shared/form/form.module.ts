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
import { DateComponent } from './date/date.component';
import { IonicModule } from '@ionic/angular';
import { RangeComponent } from './range/range.component';
import { SelectComponent } from './select/select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioComponent } from './radio/radio.component';
import { SwitchComponent } from './switch/switch.component';
import { CalendarModalComponent } from './calendar/calendar-modal/calendar-modal.component';
import { ModalModule } from '../components/modal/modal.module';
import { AddressSearchModalComponent } from './address/address-search-modal/address-search-modal.component';
import { AddressComponent } from './address/address.component';
import { AutofocusDirective } from './address/autofocus.directive';
import { AddressItemComponent } from './address/address-item/address-item.component';

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
    CalendarModalComponent,
    AddressSearchModalComponent,
    AddressComponent,
    AutofocusDirective,
    AddressItemComponent,
  ],
  entryComponents: [CalendarModalComponent, AddressSearchModalComponent],
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
    AddressComponent,
    AutofocusDirective,
  ],
})
export class FormModule {}
