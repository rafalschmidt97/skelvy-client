import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import * as moment from 'moment';
import { MeetingSuggestionsModalComponent } from './meeting/meeting-suggestions-modal.component';
import { RequestSuggestionsModalComponent } from './request/request-suggestions-modal.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { _ } from '../../../core/i18n/translate';
import {
  MeetingRequestWithUserDto,
  MeetingWithUsersDto,
} from '../../meetings/meetings';
import { MeetingsService } from '../../meetings/meetings.service';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ExploreStateModel } from '../store/explore-state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  @Select(state => state.explore) $explore: Observable<ExploreStateModel>;
  isLoadingInitial = true;
  isLoadingJoin = false;
  isLoadingSuggestions = false;
  latitude: number;
  longitude: number;

  constructor(
    private readonly meetingService: MeetingsService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly modalController: ModalController,
    private readonly geolocation: Geolocation,
  ) {}

  ngOnInit() {
    this.geolocation
      .getCurrentPosition({
        timeout: 5000,
        maximumAge: 10000,
        enableHighAccuracy: false,
      })
      .then(res => {
        this.latitude = res.coords.latitude;
        this.longitude = res.coords.longitude;

        this.findInitialSuggestions(res.coords.latitude, res.coords.longitude);
      })
      .catch(() => {
        this.toastService.createError(
          _('A problem occurred while asking for location'),
        );
      });
  }

  join(meetingId: number) {
    if (!this.isLoadingJoin) {
      this.isLoadingJoin = true;

      this.meetingService.joinMeeting(meetingId).subscribe(
        () => {
          this.meetingService.findMeetings().subscribe(
            () => {
              this.isLoadingJoin = false;
              this.routerNavigation.navigateBack(['/app/tabs/meetings']);
            },
            () => {
              this.isLoadingJoin = false;
              this.toastService.createError(
                _('A problem occurred while finding the meeting'),
              );
            },
          );
        },
        () => {
          this.isLoadingJoin = false;
          this.toastService.createError(
            _('A problem occurred while joining the meeting'),
          );
          this.findSuggestions(this.latitude, this.longitude);
        },
      );
    }
  }

  connect(requestId: number) {
    if (!this.isLoadingJoin) {
      this.routerNavigation.navigateForward([
        `/app/explore/connect/${requestId}`,
      ]);
    }
  }

  findInitialSuggestions(latitude: number, longitude: number) {
    this.meetingService.findMeetingSuggestions(latitude, longitude).subscribe(
      () => {
        this.isLoadingInitial = false;
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while finding suggestions'),
        );
        this.isLoadingInitial = false;
      },
    );
  }

  findSuggestions(latitude: number, longitude: number) {
    if (!this.isLoadingSuggestions || this.isLoadingInitial) {
      this.isLoadingSuggestions = true;
      this.meetingService.findMeetingSuggestions(latitude, longitude).subscribe(
        () => {
          this.isLoadingInitial = false;
        },
        () => {
          this.isLoadingInitial = false;
        },
      );
    }
  }

  refreshSuggestions(event) {
    if (!this.isLoadingSuggestions || this.isLoadingInitial) {
      this.isLoadingSuggestions = true;
      this.meetingService
        .findMeetingSuggestions(this.latitude, this.longitude)
        .subscribe(
          () => {
            this.isLoadingSuggestions = false;
            event.target.complete();
          },
          () => {
            this.isLoadingSuggestions = false;
            event.target.complete();
          },
        );
    } else {
      event.target.complete();
    }
  }

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }

  async openMeetingDetails(previewMeeting: MeetingWithUsersDto) {
    const modal = await this.modalController.create({
      component: MeetingSuggestionsModalComponent,
      componentProps: {
        meeting: previewMeeting,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.meetingId) {
      this.join(data.meetingId);
    }
  }

  async openRequestDetails(previewRequest: MeetingRequestWithUserDto) {
    const modal = await this.modalController.create({
      component: RequestSuggestionsModalComponent,
      componentProps: {
        request: previewRequest,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.requestId) {
      this.connect(data.requestId);
    }
  }
}
