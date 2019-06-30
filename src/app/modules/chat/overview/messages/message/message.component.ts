import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingUserDto } from '../../../../meeting/meeting';
import { ChatMessageDto } from '../../../chat';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() user: MeetingUserDto;
  @Input() message: ChatMessageDto;
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
