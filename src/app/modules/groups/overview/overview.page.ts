import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import {
  isSeenMessage,
  MeetingsStateModel,
} from '../../meetings/store/meetings-state';
import {
  GroupState,
  GroupUserDto,
  MessageActionType,
  MessageState,
  MessageType,
} from '../../meetings/meetings';
import { isEmpty } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '../../../core/i18n/translate';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @Select(state => state.meetings) $meetings: Observable<MeetingsStateModel>;
  sentAttachmentMessage: string;
  startConversationMessage: string;
  userId: number;

  constructor(
    private readonly translateService: TranslateService,
    private readonly store: Store,
  ) {
    this.userId = this.store.selectSnapshot(state => state.user.user.id);
    this.sentAttachmentMessage = this.translateService.instant(
      _('Sent a photo'),
    );

    this.startConversationMessage = this.translateService.instant(
      _('Start a conversation now!'),
    );
  }

  getGroupName(group: GroupState): string {
    return group.name || group.users.map(x => x.profile.name).join(', ');
  }

  getLastMessage(group: GroupState): string {
    const responseMessages = group.messages.filter(
      x => x.type === MessageType.RESPONSE,
    );

    if (isEmpty(responseMessages)) {
      return this.startConversationMessage;
    }

    const lastMessage = responseMessages[responseMessages.length - 1];
    const messageUser = group.users.find(x => x.id === lastMessage.userId);

    if (!messageUser) {
      return this.startConversationMessage;
    }

    return lastMessage.attachmentUrl
      ? `${messageUser.profile.name}: ${this.sentAttachmentMessage}`
      : `${messageUser.profile.name}: ${lastMessage.text}`;
  }

  getFirstUsers(group: GroupState): GroupUserDto[] {
    return group.users.slice(0, 4);
  }

  sortByMessages(groups: GroupState[]): GroupState[] {
    return groups.slice().sort((a, b) => {
      const aDate = !isEmpty(a.messages)
        ? a.messages[a.messages.length - 1].date
        : a.createdAt;
      const bDate = !isEmpty(b.messages)
        ? b.messages[b.messages.length - 1].date
        : b.createdAt;

      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }

  isMessageToRead(group: GroupState): boolean {
    const responseMessages = group.messages.filter(
      x =>
        x.type === MessageType.RESPONSE ||
        (x.type === MessageType.ACTION && x.action === MessageActionType.SEEN),
    );

    if (responseMessages.length > 0) {
      const lastNonSeenMessageIndex = [...responseMessages]
        .reverse()
        .findIndex((x: MessageState) => !isSeenMessage(x));

      if (lastNonSeenMessageIndex) {
        const userId = this.store.selectSnapshot(state => state.user.user.id);
        const userSeenMessage = responseMessages
          .reverse()
          .slice(0, lastNonSeenMessageIndex)
          .find(x => x.userId === userId);

        if (!userSeenMessage) {
          return true;
        }
      }
    }

    return false;
  }
}
