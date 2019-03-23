import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import * as moment from 'moment';
import { Checkbox } from '../../../shared/form/checkbox/checkbox';
import { RangeComponent } from '../../../shared/form/range/range.component';
import { MeetingService } from '../meeting.service';
import { MeetingDrink, MeetingRequest } from '../meeting';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { MeetingSocketService } from '../meeting-socket.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
})
export class EditPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  drinks: Checkbox[];
  today = moment()
    .startOf('day')
    .toDate();
  tomorrow = moment()
    .add(1, 'days')
    .startOf('day')
    .toDate();
  private readonly drinksToTranslate = [
    _('tea'),
    _('chocolate'),
    _('coffee'),
    _('beer'),
    _('wine'),
    _('vodka'),
    _('whiskey'),
  ];
  loadingDrinks = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly meetingService: MeetingService,
    private readonly meetingSocket: MeetingSocketService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
  ) {
    this.form = this.formBuilder.group({
      date: [[this.today, this.tomorrow], Validators.required],
      address: [null, Validators.required],
      age: [[18, 25], RangeComponent.minimumRangeValidator(4)],
      drinks: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.meetingService.findDrinks().subscribe(
      (drinks: MeetingDrink[]) => {
        this.drinks = drinks.map(drink => {
          return {
            label: drink.name,
            value: drink.id.toString(),
          };
        });

        this.form.patchValue({
          drinks: [this.drinks[0].value],
        });

        this.loadingDrinks = false;
      },
      () => {
        this.loadingDrinks = false;
        this.toastService.createError(
          _('A problem occurred while finding drinks'),
        );
      },
    );
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.loadingDrinks) {
      this.isLoading = true;
      const form = this.form.value;
      const request: MeetingRequest = {
        minDate: form.date[0],
        maxDate: form.date[1] || form.date[0],
        minAge: form.age[0],
        maxAge: form.age[1],
        latitude: form.address.latitude,
        longitude: form.address.longitude,
        drinks: form.drinks.map(drink => {
          return { id: drink };
        }),
      };

      this.meetingService.createMeetingRequest(request).subscribe(
        () => {
          this.meetingService.findMeeting().subscribe(
            model => {
              if (model.meeting) {
                this.meetingSocket.initialize();
              }

              if (window.history.length > 1) {
                this.routerNavigation.back();
              } else {
                this.routerNavigation.navigateBack(['/app/tabs/meeting']);
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
}
