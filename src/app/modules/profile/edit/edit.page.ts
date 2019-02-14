import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '../../../shared/form/select/select';
import { _ } from '../../../core/i18n/translate';
import { InputComponent } from '../../../shared/form/input/input.component';
import * as moment from 'moment';
import { UserStoreService } from '../user-store.service';
import { Gender, Profile, User } from '../user';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from '@ionic/angular';

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
  ];
  adultDate = moment()
    .add(-18, 'years')
    .toDate();
  deathDate = moment()
    .add(-100, 'years')
    .toDate();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userStore: UserStoreService,
    private readonly userService: UserService,
    private readonly routerNavigation: NavController,
  ) {
    this.form = this.formBuilder.group({
      photos: [[], Validators.required],
      name: [
        '',
        [
          Validators.required,
          InputComponent.noWhitespaceValidation(),
          Validators.maxLength(50),
        ],
      ],
      birthday: [moment().toDate(), Validators.required],
      gender: ['', Validators.required],
      description: [
        '',
        [InputComponent.noWhitespaceValidation(), Validators.maxLength(500)],
      ],
    });
  }

  ngOnInit() {
    this.userStore.data.subscribe(user => {
      this.fillForm(user.profile);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const profile: Profile = this.form.value;

      this.userService.updateProfile(profile).subscribe(
        () => {
          this.routerNavigation.back();
        },
        () => {
          this.isLoading = false;
          console.log('Something went wrong');
        },
      );
    }
  }

  private fillForm(profile: Profile) {
    const { photos, name, birthday, gender, description } = profile;

    this.form.patchValue({
      photos: photos,
      name: name,
      birthday: moment(birthday).toDate(),
      gender: gender,
      description: description || '',
    });
  }
}
