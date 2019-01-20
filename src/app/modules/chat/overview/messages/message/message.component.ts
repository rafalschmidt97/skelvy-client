import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingUser } from '../../../../meeting/meeting';
import { Message } from '../../../chat';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() user: MeetingUser;
  @Input() message: Message;
  @Input() isMine: boolean;
  @Input() isNotLast: boolean;
  @Input() isNotFirst: boolean;
  @Output() showDetails = new EventEmitter<MeetingUser>();
  showDate = false;

  toggleDate() {
    this.showDate = !this.showDate;
  }
}
