import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MeetingRequestDto } from '../../meeting';
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

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
})
export class SearchingComponent {
  @Input() request: MeetingRequestDto;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  alert: Alert;
  loadingRemove = false;

  constructor(
    private readonly alertService: AlertService,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingService,
  ) {}

  get label(): string {
    const start = this.request.minDate;
    const end = this.request.maxDate;

    if (end !== start) {
      return `${moment(start).format('DD.MM.YYYY')} - ${moment(end).format(
        'DD.MM.YYYY',
      )}`;
    }

    return moment(start).format('DD.MM.YYYY');
  }

  stop() {
    this.loadingRemove = false;
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmAlert() {
    this.loadingRemove = true;
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
