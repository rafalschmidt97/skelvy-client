import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingUser } from '../../../../meeting/meeting';
import { ChatMessage } from '../../../chat';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() user: MeetingUser;
  @Input() message: ChatMessage;
  @Input() isMine: boolean;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() dateToShow: Date;
  @Output() showDate = new EventEmitter<Date>();

  toggleDate() {
    this.showDate.emit(this.message.date);
  }

  get isDateShown(): boolean {
    return this.message.date === this.dateToShow;
  }
}
