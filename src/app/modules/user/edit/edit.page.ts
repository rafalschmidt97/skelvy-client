import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '../../../shared/form/select/select';
import { _ } from '../../../core/i18n/translate';
import { InputComponent } from '../../../shared/form/input/input.component';
import * as moment from 'moment';
import { Gender, ProfileRequest } from '../user';
import { UserService } from '../user.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
})
export class EditPage implements Form, OnSubmit, OnInit {
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
  created = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {
    const {
      photos,
      name,
      birthday,
      gender,
      description,
    } = this.store.selectSnapshot(state => state.user.user.profile);

    this.form = this.formBuilder.group({
      photos: [photos, Validators.required],
      name: [
        name,
        [
          Validators.required,
          InputComponent.noWhitespaceValidation(),
          Validators.minLength(3),
          Validators.maxLength(15),
          InputComponent.regex(/^[\p{L} ]+$/gu),
          InputComponent.maxWhiteSpaces(1),
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

  ngOnInit() {
    this.created = !!this.route.snapshot.paramMap.get('created');
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      const form = this.form.value;

      const profile: ProfileRequest = {
        name: form.name.trim(),
        description: form.description.trim(),
        birthday: form.birthday,
        gender: form.gender,
        photos: form.photos,
      };

      this.userService.updateProfile(profile).subscribe(
        () => {
          if (this.created) {
            this.routerNavigation.navigateForward([
              '/app/settings/username',
              { created: true },
            ]);
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
