import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '../../../../user/user';
import { ChatMessageState } from '../../../../meeting/meeting';
import isOnlyEmojis from 'is-only-emojis';

@Component({
  selector: 'app-message-user',
  templateUrl: './message-user.component.html',
  styleUrls: ['./message-user.component.scss'],
})
export class MessageUserComponent {
  @Input() user: UserDto;
  @Input() message: ChatMessageState;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() dateToShow: string;
  @Output() showDate = new EventEmitter<string>();
  @Output() showActions = new EventEmitter<ChatMessageState>();
  @Output() showPreview = new EventEmitter<string>();

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

  actions() {
    this.showActions.emit(this.message);
  }

  preview() {
    this.showPreview.emit(this.message.attachmentUrl);
  }
}
