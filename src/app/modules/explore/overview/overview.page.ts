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
  isLoading = false;
  isLoadingSuggestions = true;
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

        this.findSuggestions(res.coords.latitude, res.coords.longitude, true);
      })
      .catch(() => {
        this.toastService.createError(
          _('A problem occurred while asking for location'),
        );
        // TODO: add address input
      });
  }

  join(meetingId: number) {
    if (!this.isLoading) {
      this.isLoading = true;

      this.meetingService.joinMeeting(meetingId).subscribe(
        () => {
          this.meetingService.findMeetings().subscribe(
            () => {
              this.isLoading = false;
              this.routerNavigation.navigateBack(['/app/tabs/meetings']);
            },
            () => {
              this.isLoading = false;
              this.toastService.createError(
                _('A problem occurred while finding the meeting'),
              );
            },
          );
        },
        () => {
          this.isLoading = false;
          this.toastService.createError(
            _('A problem occurred while joining the meeting'),
          );
          this.findSuggestions(this.latitude, this.longitude);
        },
      );
    }
  }

  connect(requestId: number) {
    if (!this.isLoading) {
      this.routerNavigation.navigateForward([
        `/app/explore/connect/${requestId}`,
      ]);
    }
  }

  findSuggestions(latitude: number, longitude: number, isInitial = false) {
    if (!this.isLoading && (!this.isLoadingSuggestions || isInitial)) {
      this.isLoadingSuggestions = true;
      this.meetingService.findMeetingSuggestions(latitude, longitude).subscribe(
        () => {
          this.isLoadingSuggestions = false;
        },
        () => {
          this.isLoadingSuggestions = false;
        },
      );
    }
  }

  refreshSuggestions(event) {
    if (!this.isLoading && !this.isLoadingSuggestions) {
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
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data.meetingId) {
      this.join(data.meetingId);
    }
  }

  async openRequestDetails(previewRequest: MeetingRequestWithUserDto) {
    const modal = await this.modalController.create({
      component: RequestSuggestionsModalComponent,
      componentProps: {
        request: previewRequest,
      },
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data.requestId) {
      this.connect(data.requestId);
    }
  }
}
