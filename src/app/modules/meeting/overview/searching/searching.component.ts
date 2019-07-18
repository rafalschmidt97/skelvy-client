import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  MeetingRequestDto,
  MeetingStatus,
  MeetingSuggestionsModel,
} from '../../meeting';
import { MapsService } from '../../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { LoadingService } from '../../../../core/loading/loading.service';
import { MeetingService } from '../../meeting.service';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { AlertModalComponent } from '../../../../shared/components/alert/alert-modal/alert-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
})
export class SearchingComponent implements OnInit, OnDestroy {
  @Input() request: MeetingRequestDto;
  isLoading = false;
  loadingSuggestions = false;
  suggestions: MeetingSuggestionsModel;
  statusSubscription: Subscription;

  constructor(
    private readonly modalController: ModalController,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingService,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    this.statusSubscription = this.store
      .select(state => state.meeting)
      .subscribe(meeting => {
        if (
          meeting.meetingModel &&
          meeting.meetingModel.status === MeetingStatus.SEARCHING &&
          !meeting.loading
        ) {
          this.findSuggestions(
            meeting.meetingModel.request.latitude,
            meeting.meetingModel.request.longitude,
          );
        }
      });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
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

  findSuggestions(latitude: number, longitude: number) {
    if (!this.loadingSuggestions) {
      this.loadingSuggestions = true;
      this.meetingService.findMeetingSuggestions(latitude, longitude).subscribe(
        suggestions => {
          this.suggestions = suggestions;
          this.loadingSuggestions = false;
        },
        () => {
          this.loadingSuggestions = false;
        },
      );
    }
  }

  join(meetingId: number) {
    if (!this.isLoading) {
      this.isLoading = true;

      this.meetingService.joinMeeting(meetingId).subscribe(
        () => {
          this.meetingService.findMeeting().subscribe(
            () => {},
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
            _('A problem occurred while joining the meeting'),
          );
          this.findSuggestions(this.request.latitude, this.request.longitude);
        },
      );
    }
  }

  connect(requestId: number) {
    if (!this.isLoading) {
      this.isLoading = true;

      this.meetingService.connectMeetingRequest(requestId).subscribe(
        () => {
          this.meetingService.findMeeting().subscribe(
            () => {},
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
            _('A problem occurred while connecting the request'),
          );
          this.findSuggestions(this.request.latitude, this.request.longitude);
        },
      );
    }
  }

  async stop() {
    if (!this.isLoading) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant('Are you sure?'),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        this.confirmStop();
      }
    }
  }

  confirmStop() {
    this.isLoading = true;
    this.loadingService.lock();
    this.meetingService.removeMeetingRequest().subscribe(
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
      },
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404 || error.status === 409) {
          this.meetingService.findMeeting().subscribe();
        }

        this.isLoading = false;
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while removing the request'),
        );
      },
    );
  }
}
