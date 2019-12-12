import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupUserDto, MessageState } from '../../../../meetings/meetings';
import isOnlyEmojis from 'is-only-emojis';

@Component({
  selector: 'app-message-user',
  templateUrl: './message-user.component.html',
  styleUrls: ['./message-user.component.scss'],
})
export class MessageUserComponent {
  @Input() user: GroupUserDto;
  @Input() message: MessageState;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() dateToShow: string;
  @Output() showDate = new EventEmitter<string>();
  @Output() showActions = new EventEmitter<MessageState>();
  @Output() showPreview = new EventEmitter<string>();

  get isDateShown(): boolean {
    return this.message.date === this.dateToShow;
  }

  get isOnlyEmoji(): boolean {
    return (
      this.message.text &&
      isOnlyEmojis(this.message.text) &&
      this.message.text.length <= 60
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
