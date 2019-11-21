import { Component, Input } from '@angular/core';
import { MeetingRequestDto } from '../../meeting';
import { MapsService } from '../../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { LoadingService } from '../../../../core/loading/loading.service';
import { MeetingService } from '../../meeting.service';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertModalComponent } from '../../../../shared/components/alert/alert-modal/alert-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
})
export class SearchingComponent {
  @Input() request: MeetingRequestDto;
  isLoading = false;

  constructor(
    private readonly modalController: ModalController,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingService,
  ) {}

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
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
    this.meetingService.removeMeetingRequest(this.request.id).subscribe(
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
