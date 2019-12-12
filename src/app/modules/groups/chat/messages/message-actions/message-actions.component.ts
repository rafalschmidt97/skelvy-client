import { Component, Input } from '@angular/core';
import {
  GroupUserDto,
  MessageActionType,
  MessageState,
} from '../../../../meetings/meetings';

@Component({
  selector: 'app-message-actions',
  templateUrl: './message-actions.component.html',
  styleUrls: ['./message-actions.component.scss'],
})
export class MessageActionsComponent {
  @Input() user: GroupUserDto;
  @Input() message: MessageState;
  messageActionType = MessageActionType;
}
