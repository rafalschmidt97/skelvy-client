import { Component, Input } from '@angular/core';
import { UserDto } from '../../../../user/user';
import { MessageActionType, MessageState } from '../../../../meetings/meetings';

@Component({
  selector: 'app-message-actions',
  templateUrl: './message-actions.component.html',
  styleUrls: ['./message-actions.component.scss'],
})
export class MessageActionsComponent {
  @Input() user: UserDto;
  @Input() message: MessageState;
  messageActionType = MessageActionType;
}
