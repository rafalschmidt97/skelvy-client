import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatMessageDto } from '../../../chat';

@Component({
  selector: 'app-message-anonymous',
  templateUrl: './message-anonymous.component.html',
  styleUrls: ['./message-anonymous.component.scss'],
})
export class MessageAnonymousComponent {
  @Input() message: ChatMessageDto;
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
