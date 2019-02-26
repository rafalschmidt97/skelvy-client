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

  constructor(
    private readonly alertService: AlertService,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
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
          this.toastService.createError(_('Something went wrong'));
        },
      );
  }

  stop() {
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmAlert() {
    // TODO: use service to remove request
    this.alert.hide();
  }

  declineAlert() {
    this.alert.hide();
  }
}
