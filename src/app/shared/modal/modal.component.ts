import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title: string;
  @Output() decline = new EventEmitter();
  @Output() confirm = new EventEmitter();

  get hasConfirm() {
    return this.confirm.observers.length > 0;
  }

  get hasDecline() {
    return this.decline.observers.length > 0;
  }
}
