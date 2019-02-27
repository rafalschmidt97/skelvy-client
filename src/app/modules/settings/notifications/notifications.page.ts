import { Component } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly routerNavigation: NavController,
  ) {
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
        if (window.history.length > 1) {
          this.routerNavigation.back();
        } else {
          this.routerNavigation.navigateBack(['/app/tabs/settings']);
        }
      }, 2000);
    }
  }
}
