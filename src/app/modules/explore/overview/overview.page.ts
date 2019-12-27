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
import { Storage } from '@ionic/storage';
import { storageKeys } from '../../../core/storage/storage';
import { AddressSearchModalComponent } from '../../../shared/form/address/address-search-modal/address-search-modal.component';
import { MapsResponse, MapsResponseType } from '../../../core/maps/maps';
import { TranslateService } from '@ngx-translate/core';
import { MapsService } from '../../../core/maps/maps.service';

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
  location: MapsResponse;
  results: MapsResponse[];
  lastSearch = '';

  constructor(
    private readonly meetingService: MeetingsService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly modalController: ModalController,
    private readonly geolocation: Geolocation,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
    private readonly mapsService: MapsService,
  ) {}

  async ngOnInit() {
    const lastLocation = await this.storage.get(
      storageKeys.lastExploreLocation,
    );

    if (lastLocation) {
      this.location = lastLocation;

      this.findSuggestions(lastLocation.latitude, lastLocation.longitude);
    } else {
      this.geolocation
        .getCurrentPosition({
          timeout: 5000,
          maximumAge: 10000,
          enableHighAccuracy: false,
        })
        .then(res => {
          this.mapsService
            .reverse(
              res.coords.latitude,
              res.coords.longitude,
              this.translateService.currentLang,
            )
            .subscribe(
              async results => {
                if (results.length > 0) {
                  this.location = results[0];
                  await this.storage.set(
                    storageKeys.lastExploreLocation,
                    results[0],
                  );

                  this.findSuggestions(
                    results[0].latitude,
                    results[0].longitude,
                  );
                }
              },
              () => {
                this.toastService.createError(
                  _('A problem occurred while resolving the location'),
                );
              },
            );
        })
        .catch(() => {
          this.isLoadingInitial = false;
        });
    }
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
          this.findSuggestions(this.location.latitude, this.location.longitude);
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

  findSuggestions(latitude: number, longitude: number) {
    this.isLoadingInitial = true;
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

  refreshSuggestions(event) {
    if (!this.isLoadingSuggestions) {
      this.isLoadingSuggestions = true;
      this.meetingService
        .findMeetingSuggestions(this.location.latitude, this.location.longitude)
        .subscribe(
          () => {
            this.isLoadingSuggestions = false;
            event.target.complete();
          },
          () => {
            this.toastService.createError(
              _('A problem occurred while finding suggestions'),
            );
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

  async changeLocation() {
    if (!this.isLoadingSuggestions) {
      const modal = await this.modalController.create({
        component: AddressSearchModalComponent,
        componentProps: {
          results: this.results,
          lastSearch: this.lastSearch,
          placeholder: this.translateService.instant('Type in your city...'),
        },
        cssClass: 'ionic-modal ionic-full-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data) {
        this.results = data.results;
        this.lastSearch = data.lastSearch;
        this.location = data.result;

        await this.storage.set(storageKeys.lastExploreLocation, data.result);

        this.findSuggestions(data.result.latitude, data.result.longitude);
      }
    }
  }

  isNotCity(type: string): boolean {
    return type !== MapsResponseType.LOCALITY;
  }
}
