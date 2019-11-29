import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import * as moment from 'moment';
import { MeetingsService } from '../meetings.service';
import { ActivityDto, MeetingRequest } from '../meetings';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { MeetingsSocketService } from '../meetings-socket.service';
import { Storage } from '@ionic/storage';
import { isNil, range } from 'lodash';
import { storageKeys } from '../../../core/storage/storage';
import { Radio } from '../../../shared/form/radio/radio';
import { Select } from '../../../shared/form/select/select';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.page.html',
  styleUrls: ['./edit-meeting.page.scss'],
})
export class EditMeetingPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  activities: Radio[];
  today = moment()
    .startOf('day')
    .toDate();
  loadingForm = true;
  sizes: Select[] = range(2, 11).map(number => {
    return {
      label: number.toString(),
      value: number,
    };
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly meetingService: MeetingsService,
    private readonly meetingSocket: MeetingsSocketService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly storage: Storage,
  ) {
    this.form = this.formBuilder.group({
      date: [this.today, Validators.required],
      address: [null, Validators.required],
      activityId: [null, Validators.required],
      size: [4, Validators.required],
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
      const request: MeetingRequest = {
        date: form.date,
        latitude: form.address.latitude,
        longitude: form.address.longitude,
        activityId: form.activityId,
        size: form.size,
      };

      this.meetingService.createMeeting(request).subscribe(
        async () => {
          await this.storage.set(storageKeys.lastMeetingForm, form);

          this.meetingService.findMeeting().subscribe(
            () => {
              this.routerNavigation.navigateBack(['/app/tabs/meetings']);
            },
            () => {
              this.toastService.createError(
                _('A problem occurred while finding meetings'),
              );
            },
          );
        },
        () => {
          this.isLoading = false;
          this.toastService.createError(
            _('A problem occurred while creating the meeting'),
          );
        },
      );
    }
  }

  private fillForm() {
    this.storage
      .get(storageKeys.lastMeetingForm)
      .then(meetingForm => {
        if (!isNil(meetingForm)) {
          const minDate = new Date(meetingForm.date);
          const minDateValidated = minDate >= this.today ? minDate : this.today;

          this.form.patchValue({
            date: minDateValidated,
            address: meetingForm.address,
            activityId: meetingForm.activityId,
            size: meetingForm.size,
          });
        } else {
          this.form.patchValue({
            activityId: this.activities[0].value,
          });
        }

        this.loadingForm = false;
      })
      .catch(() => {
        this.loadingForm = false;
      });
  }
}
