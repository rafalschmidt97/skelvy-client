import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import * as moment from 'moment';
import { Checkbox } from '../../../shared/form/checkbox/checkbox';
import { RangeComponent } from '../../../shared/form/range/range.component';
import { MeetingService } from '../meeting.service';
import { MeetingDrinkDto, MeetingRequestDto } from '../meeting';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { MeetingSocketService } from '../meeting-socket.service';
import { UserStoreService } from '../../user/user-store.service';
import { Storage } from '@ionic/storage';
import { isNil } from 'lodash';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
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
  loadingForm = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly meetingService: MeetingService,
    private readonly meetingSocket: MeetingSocketService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly userStore: UserStoreService,
    private readonly storage: Storage,
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
      (drinks: MeetingDrinkDto[]) => {
        this.drinks = drinks.map(drink => {
          return {
            label: drink.name,
            value: drink.id.toString(),
          };
        });

        this.fillForm();
      },
      () => {
        this.loadingForm = false;
        this.toastService.createError(
          _('A problem occurred while finding drinks'),
        );
      },
    );
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.loadingForm) {
      this.isLoading = true;
      const form = this.form.value;
      const request: MeetingRequestDto = {
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
          this.storage.set('lastMeetingRequestForm', form);

          this.meetingService.findMeeting().subscribe(
            () => {
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

  private fillForm() {
    this.storage
      .get('lastMeetingRequestForm')
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
            drinks: requestForm.drinks,
          });
        } else {
          this.form.patchValue({
            drinks: [
              this.drinks[1].value,
              this.drinks[2].value,
              this.drinks[3].value,
            ],
          });

          const userAge = moment().diff(
            this.userStore.data.profile.birthday,
            'years',
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
