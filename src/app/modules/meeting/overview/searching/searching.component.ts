import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MeetingRequestDto,
  MeetingStatus,
  MeetingSuggestionsModel,
} from '../../meeting';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';
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

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
})
export class SearchingComponent implements OnInit, OnDestroy {
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  @Input() request: MeetingRequestDto;
  alert: Alert;
  isLoading = false;
  loadingSuggestions = false;
  suggestions: MeetingSuggestionsModel;
  statusSubscription: Subscription;

  constructor(
    private readonly alertService: AlertService,
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
          meeting.meeting &&
          meeting.meeting.status === MeetingStatus.SEARCHING &&
          !meeting.loading
        ) {
          this.findSuggestions(
            meeting.meeting.request.latitude,
            meeting.meeting.request.longitude,
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

  stop() {
    this.isLoading = false;
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmAlert() {
    this.isLoading = true;
    this.loadingService.lock();
    this.meetingService.removeMeetingRequest().subscribe(
      () => {
        this.alert.hide();
        this.loadingService.unlock();
      },
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404 || error.status === 409) {
          this.meetingService.findMeeting().subscribe();
        }

        this.alert.hide();
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while removing the request'),
        );
      },
    );
  }

  declineAlert() {
    this.alert.hide();
  }
}
