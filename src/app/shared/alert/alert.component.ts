import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() confirmText: string;
  @Input() confirmLoading = false;
  @Input() declineText: string;
  @Output() confirm = new EventEmitter();
  @Output() decline = new EventEmitter();

  get hasConfirm(): boolean {
    return this.confirm.observers.length > 0;
  }

  get hasDecline(): boolean {
    return this.decline.observers.length > 0;
  }
}
