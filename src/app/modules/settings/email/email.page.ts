import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { InputComponent } from '../../../shared/form/input/input.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class EmailPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  initialValue: string;
  created = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly routerNavigation: NavController,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
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
  ngOnInit() {
    this.created = !!this.route.snapshot.paramMap.get('created');

    if (this.created) {
      this.initialValue = '';
    }
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.isInitial) {
      const form = this.form.value;

      this.isLoading = true;
      this.userService.updateEmail(form.email.trim().toLowerCase()).subscribe(
        () => {
          this.isLoading = false;

          if (this.created) {
            this.routerNavigation.navigateForward(['/app/tabs/user']);
          } else {
            this.routerNavigation.navigateBack(['/app/settings']);
          }
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
