import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import * as moment from 'moment';
import { MeetingsService } from '../../meetings/meetings.service';
import { ConnectRequest } from '../../meetings/meetings';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { MeetingsSocketService } from '../../meetings/meetings-socket.service';
import { Radio } from '../../../shared/form/radio/radio';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ExploreStateModel } from '../store/explore-state';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  activities: Radio[];
  loadingForm = true;
  requestId: number;
  minDate: Date;
  maxDate: Date;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly meetingService: MeetingsService,
    private readonly meetingSocket: MeetingsSocketService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {
    this.form = this.formBuilder.group({
      date: [null, Validators.required],
      activityId: [null, Validators.required],
    });
  }

  ngOnInit() {
    const requestId = +this.route.snapshot.paramMap.get('id');

    if (!requestId) {
      this.routerNavigation.navigateBack(['/app/tabs/explore']);
    }

    this.requestId = requestId;
    this.fillForm();
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.loadingForm) {
      this.isLoading = true;
      const form = this.form.value;
      const request: ConnectRequest = {
        date: form.date,
        activityId: Number(form.activityId),
      };

      this.meetingService
        .connectMeetingRequest(this.requestId, request)
        .subscribe(
          async () => {
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
              _('A problem occurred while connecting to the request'),
            );
          },
        );
    }
  }

  fillForm() {
    const exploreState: ExploreStateModel = this.store.selectSnapshot(
      state => state.explore,
    );

    const request = exploreState.requests.find(x => x.id === this.requestId);

    if (!request) {
      this.routerNavigation.navigateBack(['/app/tabs/explore']);
    }

    this.activities = request.activities.map(type => {
      return {
        label: type.name,
        value: type.id.toString(),
      };
    });

    const today = moment()
      .startOf('day')
      .toDate();

    const selectedDate =
      new Date(request.minDate) > today ? new Date(request.minDate) : today;

    this.minDate = selectedDate;
    this.maxDate = new Date(request.maxDate);

    this.form.patchValue({
      date: selectedDate,
      activityId: request.activities[0].id.toString(),
    });

    this.loadingForm = false;
  }
}
