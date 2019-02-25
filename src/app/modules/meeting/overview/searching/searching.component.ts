import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MeetingRequest } from '../../meeting';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss'],
})
export class SearchingComponent {
  @Input() request: MeetingRequest;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  alert: Alert;

  constructor(private readonly alertService: AlertService) {}

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
