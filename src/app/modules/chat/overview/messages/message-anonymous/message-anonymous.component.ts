import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatMessageState } from '../../../chat';

@Component({
  selector: 'app-message-anonymous',
  templateUrl: './message-anonymous.component.html',
  styleUrls: ['../message/message.component.scss'],
})
export class MessageAnonymousComponent {
  @Input() message: ChatMessageState;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() dateToShow: string;
  @Output() showDate = new EventEmitter<string>();

  get isDateShown(): boolean {
    return this.message.date === this.dateToShow;
  }

  toggleDate() {
    this.showDate.emit(this.message.date);
  }
}
