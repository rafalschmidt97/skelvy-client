import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingUserDto } from '../../../../meeting/meeting';
import { ChatMessageDto } from '../../../chat';

@Component({
  selector: 'app-message-user',
  templateUrl: './message-user.component.html',
  styleUrls: ['./message-user.component.scss'],
})
export class MessageUserComponent {
  @Input() user: MeetingUserDto;
  @Input() message: ChatMessageDto;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() dateToShow: string;
  @Output() showDate = new EventEmitter<string>();
  @Output() showActions = new EventEmitter<ChatMessageDto>();

  get isDateShown(): boolean {
    return this.message.date === this.dateToShow;
  }

  toggleDate() {
    this.showDate.emit(this.message.date);
  }

  actions() {
    this.showActions.emit(this.message);
  }
}
