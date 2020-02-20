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
import { ActivatedRoute } from '@angular/router';
import { MeetingsStateModel } from '../store/meetings-state';
import { Store } from '@ngxs/store';
import { MapsService } from '../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { InputComponent } from '../../../shared/form/input/input.component';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.page.html',
  styleUrls: ['./edit-meeting.page.scss'],
})
export class EditMeetingPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  activities: Radio[];
  activitiesResponse: ActivityDto[];
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
  hiddenOptions: Select[] = [
    {
      label: _('Yes'),
      value: 'true',
    },
    {
      label: _('No'),
      value: 'false',
    },
  ];
  meetingId: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly meetingService: MeetingsService,
    private readonly meetingSocket: MeetingsSocketService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly storage: Storage,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      date: [this.today, Validators.required],
      address: [null, Validators.required],
      activityId: [null, Validators.required],
      size: [4, Validators.required],
      description: [
        '',
        [
          Validators.maxLength(500),
          InputComponent.maxEndline(5),
          InputComponent.maxWhiteSpaces(200),
        ],
      ],
      isHidden: ['true', Validators.required],
    });
  }

  async ngOnInit() {
    const allowRestricted = await this.storage.get(storageKeys.restricted);
    this.meetingService.findActivities(!!allowRestricted).subscribe(
      (activities: ActivityDto[]) => {
        this.activitiesResponse = activities;
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
        activityId: Number(form.activityId),
        size: Number(form.size),
        description: form.description.trim(),
        isHidden: form.isHidden === 'true',
      };

      if (!this.meetingId) {
        this.meetingService.createMeeting(request).subscribe(
          async () => {
            await this.storage.set(storageKeys.lastMeetingForm, form);

            this.meetingService.findMeetings().subscribe(
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
      } else {
        const chosenActivity = this.activitiesResponse.find(
          x => x.id === request.activityId,
        );
        const chosenCity = form.address.city;
        this.meetingService
          .updateMeeting(this.meetingId, request, chosenActivity, chosenCity)
          .subscribe(
            () => {
              this.routerNavigation.navigateBack([
                '/app/meetings/details',
                this.meetingId,
              ]);
            },
            (error: HttpErrorResponse) => {
              if (error.status === 404) {
                this.routerNavigation.navigateBack(['/app/tabs/meetings']);
                this.meetingService.findMeetings().subscribe();
              }

              this.isLoading = false;
              this.toastService.createError(
                _('A problem occurred while updating the meeting'),
              );
            },
          );
      }
    }
  }

  async fillForm() {
    const meetingId = +this.route.snapshot.paramMap.get('id');

    if (meetingId) {
      const meetingState: MeetingsStateModel = this.store.selectSnapshot(
        state => state.meetings,
      );

      const meeting = meetingState.meetings.find(x => x.id === meetingId);

      if (!meeting) {
        this.routerNavigation.navigateBack(['/app/tabs/meetings']);
      }

      const address = await this.mapsService
        .reverse(
          meeting.latitude,
          meeting.longitude,
          this.translateService.currentLang,
        )
        .toPromise();

      this.form.patchValue({
        date: new Date(meeting.date),
        address: address[0] || null,
        activityId: meeting.activity.id.toString(),
        size: meeting.size,
        description: meeting.description || '',
        isHidden: meeting.isHidden ? 'true' : 'false',
      });

      this.meetingId = meetingId;
      this.loadingForm = false;
    } else {
      this.storage
        .get(storageKeys.lastMeetingForm)
        .then(meetingForm => {
          if (!isNil(meetingForm)) {
            const date = new Date(meetingForm.date);
            const dateValidated = date >= this.today ? date : this.today;

            this.form.patchValue({
              date: dateValidated,
              address: meetingForm.address,
              activityId: meetingForm.activityId,
              size: meetingForm.size,
              isHidden: meetingForm.isHidden,
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
}
