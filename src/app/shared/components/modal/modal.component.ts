import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title: string;
  @Input() confirmLoading = false;
  @Output() decline = new EventEmitter();
  @Output() confirm = new EventEmitter();

  get hasConfirm(): boolean {
    return this.confirm.observers.length > 0;
  }

  get hasDecline(): boolean {
    return this.decline.observers.length > 0;
  }

  confirmEmit() {
    if (!this.confirmLoading) {
      this.confirm.emit();
    }
  }
}
