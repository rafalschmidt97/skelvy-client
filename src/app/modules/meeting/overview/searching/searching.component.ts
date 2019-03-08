import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MeetingRequest } from '../../meeting';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';
import { MapsService } from '../../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { MapsResponse } from '../../../../core/maps/maps';
import { LoadingService } from '../../../../core/loading/loading.service';
import { MeetingService } from '../../meeting.service';
import { MeetingHubService } from '../../meeting-hub.service';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
})
export class SearchingComponent implements OnInit {
  @Input() request: MeetingRequest;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  alert: Alert;
  loadingLocation = true;
  location: MapsResponse;
  loadingRemove = false;

  constructor(
    private readonly alertService: AlertService,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingService,
    private readonly meetingHub: MeetingHubService,
  ) {}

  ngOnInit() {
    this.mapsService
      .reverse(
        this.request.latitude,
        this.request.longitude,
        this.translateService.currentLang,
      )
      .subscribe(
        results => {
          if (results.length > 0) {
            this.location = results[0];
          }

          this.loadingLocation = false;
        },
        () => {
          this.loadingLocation = false;
          this.toastService.createError(
            _('A problem occurred while searching the location'),
          );
        },
      );
  }

  stop() {
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmAlert() {
    this.loadingRemove = true;
    this.loadingService.lock();
    this.meetingHub.disconnect();
    this.meetingService.removeMeetingRequest().subscribe(
      () => {
        this.alert.hide();
        this.loadingService.unlock();
        this.loadingRemove = false;
      },
      () => {
        this.alert.hide();
        this.loadingService.unlock();
        this.loadingRemove = false;
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
