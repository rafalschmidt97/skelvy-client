import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() title: string;
  @Input() description: string;
  @Output() confirm = new EventEmitter();
  @Output() decline = new EventEmitter();
  @Input() confirmText: string;
  @Input() confirmLoading = false;
  @Input() declineText: string;

  get hasConfirm() {
    return this.confirm.observers.length > 0;
  }

  get hasDecline() {
    return this.decline.observers.length > 0;
  }
}
