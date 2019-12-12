import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import {
  catchError,
  debounceTime,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { InputComponent } from '../../../shared/form/input/input.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './username.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class UsernamePage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  isLoadingCheck = false;
  isNameTaken = false;
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
    const username = this.store.selectSnapshot(state => state.user.user.name);
    this.initialValue = username;
    this.form = this.formBuilder.group({
      username: [
        username || '',
        [Validators.required, InputComponent.maxWhiteSpaces(0)],
      ],
    });
  }

  ngOnInit() {
    this.created = !!this.route.snapshot.paramMap.get('created');

    if (this.created) {
      this.initialValue = '';
    }

    this.form
      .get('username')
      .valueChanges.pipe(
        filter(value => {
          const safeValue = value.trim().toLowerCase();
          return safeValue !== '' && safeValue !== this.initialValue;
        }),
        map(value => {
          this.isLoadingCheck = true;
          return value;
        }),
        debounceTime(1000),
        switchMap(name => {
          return this.userService.checkNameAvailable(name);
        }),
        catchError(() => {
          return of(false);
        }),
      )
      .subscribe(isAvailable => {
        this.isLoadingCheck = false;
        this.isNameTaken = !isAvailable;
      });
  }

  onSubmit() {
    if (
      this.form.valid &&
      !this.isLoading &&
      !this.isLoadingCheck &&
      !this.isNameTaken &&
      !this.isInitial
    ) {
      const form = this.form.value;

      this.isLoading = true;
      this.userService.updateName(form.username.trim().toLowerCase()).subscribe(
        () => {
          if (this.created) {
            this.routerNavigation.navigateForward([
              '/app/settings/email',
              { created: true },
            ]);
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
    return this.initialValue === this.form.value.username.trim().toLowerCase();
  }
}
