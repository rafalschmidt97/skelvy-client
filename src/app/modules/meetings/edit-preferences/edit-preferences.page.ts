import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import * as moment from 'moment';
import { Checkbox } from '../../../shared/form/checkbox/checkbox';
import { RangeComponent } from '../../../shared/form/range/range.component';
import { MeetingsService } from '../meetings.service';
import { ActivityDto, MeetingRequestRequest } from '../meetings';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { MeetingsSocketService } from '../meetings-socket.service';
import { Storage } from '@ionic/storage';
import { isNil } from 'lodash';
import { storageKeys } from '../../../core/storage/storage';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-preferences.page.html',
  styleUrls: ['./edit-preferences.page.scss'],
})
export class EditPreferencesPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  activities: Checkbox[];
  today = moment()
    .startOf('day')
    .toDate();
  tomorrow = moment()
    .add(1, 'days')
    .startOf('day')
    .toDate();
  loadingForm = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly meetingService: MeetingsService,
    private readonly meetingSocket: MeetingsSocketService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly storage: Storage,
    private readonly store: Store,
  ) {
    this.form = this.formBuilder.group({
      date: [[this.today, this.tomorrow], Validators.required],
      address: [null, Validators.required],
      age: [[18, 25], RangeComponent.minimumRangeValidator(4)],
      activities: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.meetingService.findActivities().subscribe(
      (activities: ActivityDto[]) => {
        this.activities = activities.map(type => {
          return {
            label: type.name,
            value: type.id.toString(),
          };
        });

        this.fillForm();
      },
      () => {
        this.loadingForm = false;
        this.toastService.createError(
          _('A problem occurred while finding activities'),
        );
      },
    );
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.loadingForm) {
      this.isLoading = true;
      const form = this.form.value;
      const request: MeetingRequestRequest = {
        minDate: form.date[0],
        maxDate: form.date[1] || form.date[0],
        minAge: form.age[0],
        maxAge: form.age[1],
        latitude: form.address.latitude,
        longitude: form.address.longitude,
        activities: form.activities.map(activityId => {
          return { id: activityId };
        }),
      };

      this.meetingService.createMeetingRequest(request).subscribe(
        async () => {
          await this.storage.set(storageKeys.lastRequestForm, form);

          this.meetingService.findMeeting().subscribe(
            () => {
              if (window.history.length > 1) {
                this.routerNavigation.back();
              } else {
                this.routerNavigation.navigateBack(['/app/tabs/meetings']);
              }
            },
            () => {
              this.toastService.createError(
                _('A problem occurred while finding the meeting'),
              );
            },
          );
        },
        () => {
          this.isLoading = false;
          this.toastService.createError(
            _('A problem occurred while creating the request'),
          );
        },
      );
    }
  }

  private fillForm() {
    this.storage
      .get(storageKeys.lastRequestForm)
      .then(requestForm => {
        if (!isNil(requestForm)) {
          const minDate = new Date(requestForm.date[0]);
          const minDateValidated = minDate >= this.today ? minDate : this.today;
          const maxDate = requestForm.date[1]
            ? new Date(requestForm.date[1])
            : null;
          const maxDateValidated = maxDate
            ? maxDate > minDateValidated
              ? maxDate
              : moment(minDateValidated)
                  .add(1, 'days')
                  .startOf('day')
                  .toDate()
            : null;

          this.form.patchValue({
            date: maxDateValidated
              ? [minDateValidated, maxDateValidated]
              : [minDateValidated],
            address: requestForm.address,
            age: requestForm.age,
            activities: requestForm.activities,
          });
        } else {
          this.form.patchValue({
            activities: [this.activities[0].value, this.activities[1].value],
          });

          const userAge = this.store.selectSnapshot(
            state => state.user.user.profile.age,
          );

          if (userAge >= 21 && userAge < 52) {
            this.form.patchValue({
              age: [userAge - 3, userAge + 3],
            });
          } else {
            if (userAge > 52) {
              this.form.patchValue({
                age: [45, 55],
              });
            }
          }
        }

        this.loadingForm = false;
      })
      .catch(() => {
        this.loadingForm = false;
      });
  }
}
