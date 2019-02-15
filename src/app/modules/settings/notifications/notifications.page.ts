import { Component } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      meetings: [true, Validators.required],
      messages: [true, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      console.log(this.form.value);

      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }
}
