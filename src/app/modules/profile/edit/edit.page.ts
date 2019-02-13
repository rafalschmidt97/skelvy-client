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
  user$: Observable<User>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userStore: UserStoreService,
  ) {
    this.form = this.formBuilder.group({
      images: [[], Validators.required],
      name: [
        '',
        [Validators.required, InputComponent.noWhitespaceValidation()],
      ],
      birthday: [moment().toDate(), Validators.required],
      gender: ['', Validators.required],
      description: ['', InputComponent.noWhitespaceValidation()],
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
      console.log(this.form.value);

      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }

  private fillForm(profile: Profile) {
    const { photos, name, birthday, gender, description } = profile;

    this.form.patchValue({
      images: photos,
      name: name,
      birthday: moment(birthday).toDate(),
      gender: gender,
      description: description || '',
    });
  }
}
