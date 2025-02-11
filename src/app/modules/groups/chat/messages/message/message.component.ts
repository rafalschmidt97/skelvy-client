import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupUserDto, MessageState } from '../../../../meetings/meetings';
import isOnlyEmojis from 'is-only-emojis';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() user: GroupUserDto;
  @Input() message: MessageState;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() dateToShow: string;
  @Output() showDate = new EventEmitter<string>();
  @Output() showPreview = new EventEmitter<string>();
  @Output() openDetails = new EventEmitter<GroupUserDto>();

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

  preview() {
    this.showPreview.emit(this.message.attachmentUrl);
  }
}
