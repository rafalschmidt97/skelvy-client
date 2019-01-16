import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
  @Output() removeRequest = new EventEmitter();
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  alert: Alert;

  constructor(private readonly alertService: AlertService) {}

  stop() {
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmAlert() {
    this.alert.hide();
    this.removeRequest.emit();
  }

  declineAlert() {
    this.alert.hide();
  }
}
