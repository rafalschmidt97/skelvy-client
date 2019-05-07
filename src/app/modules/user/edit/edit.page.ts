import { Component } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '../../../shared/form/select/select';
import { _ } from '../../../core/i18n/translate';
import { InputComponent } from '../../../shared/form/input/input.component';
import * as moment from 'moment';
import { UserStoreService } from '../user-store.service';
import { Gender, ProfileDto } from '../user';
import { UserService } from '../user.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
})
export class EditPage implements Form, OnSubmit {
  form: FormGroup;
  isLoading = false;
  genders: Select[] = [
    {
      label: _('Male'),
      value: Gender.MALE,
    },
    {
      label: _('Female'),
      value: Gender.FEMALE,
    },
    {
      label: _('Other'),
      value: Gender.OTHER,
    },
  ];
  adultDate = moment()
    .add(-18, 'years')
    .startOf('day')
    .toDate();
  tooOldDate = moment()
    .add(-100, 'years')
    .startOf('day')
    .toDate();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userStore: UserStoreService,
    private readonly userService: UserService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
  ) {
    const {
      photos,
      name,
      birthday,
      gender,
      description,
    } = this.userStore.data.profile;

    this.form = this.formBuilder.group({
      photos: [photos, Validators.required],
      name: [
        name,
        [
          Validators.required,
          InputComponent.noWhitespaceValidation(),
          Validators.minLength(3),
          Validators.maxLength(50),
          InputComponent.regex(/^[\p{L} ]+$/gu),
          InputComponent.maxWhiteSpaces(5),
        ],
      ],
      birthday: [moment(birthday).toDate(), Validators.required],
      gender: [gender, Validators.required],
      description: [
        description || '',
        [
          Validators.maxLength(500),
          InputComponent.maxEndline(5),
          InputComponent.maxWhiteSpaces(200),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      const form = this.form.value;

      const profile: ProfileDto = {
        name: form.name.trim(),
        description: form.description.trim(),
        birthday: form.birthday,
        gender: form.gender,
        photos: form.photos,
      };

      this.userService.updateProfile(profile).subscribe(
        () => {
          if (window.history.length > 1) {
            this.routerNavigation.back();
          } else {
            this.routerNavigation.navigateBack(['/app/tabs/user']);
          }
        },
        () => {
          this.isLoading = false;
          this.toastService.createError(
            _('A problem occurred while updating the profile'),
          );
        },
      );
    }
  }
}
