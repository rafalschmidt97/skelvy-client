import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-unspecified',
  templateUrl: './unspecified.component.html',
  styleUrls: ['./unspecified.component.scss'],
})
export class UnspecifiedComponent {
  @Output() addMeeting = new EventEmitter();
  @Output() addRequest = new EventEmitter();
}
