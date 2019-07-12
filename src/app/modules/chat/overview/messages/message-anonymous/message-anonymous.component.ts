import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatMessageState } from '../../../../meeting/meeting';
import isOnlyEmojis from 'is-only-emojis';

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

  get isOnlyEmoji(): boolean {
    return (
      this.message.message &&
      isOnlyEmojis(this.message.message) &&
      this.message.message.length <= 60
    );
  }

  toggleDate() {
    this.showDate.emit(this.message.date);
  }
}
