import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Radio } from '../../../shared/form/radio/radio';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { LanguageConstants } from '../../../core/i18n/language.constants';
import { UserService } from '../../user/user.service';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { NavController } from '@ionic/angular';
import { storageKeys } from '../../../core/storage/storage';
import { Store } from '@ngxs/store';
import { InputComponent } from '../../../shared/form/input/input.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class EmailPage implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;
  initialValue: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly routerNavigation: NavController,
    private readonly store: Store,
  ) {
    const email = this.store.selectSnapshot(state => state.user.user.email);
    this.initialValue = email;
    this.form = this.formBuilder.group({
      email: [
        email || '',
        [
          Validators.required,
          Validators.email,
          InputComponent.maxWhiteSpaces(0),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.isInitial) {
      const form = this.form.value;

      this.isLoading = true;
      this.userService.updateEmail(form.email.trim().toLowerCase()).subscribe(
        () => {
          this.isLoading = false;
          this.routerNavigation.navigateBack(['/app/settings']);
        },
        () => {
          this.isLoading = false;
          this.routerNavigation.navigateBack(['/app/settings']);
          this.toastService.createError(
            _('A problem occurred while updating the email'),
          );
        },
      );
    }
  }

  get isInitial(): boolean {
    return this.initialValue === this.form.value.email.trim().toLowerCase();
  }
}
