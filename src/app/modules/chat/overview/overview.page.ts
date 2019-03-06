import { Component } from '@angular/core';
import { ChatModel } from '../chat';
import { MeetingStoreService } from '../../meeting/meeting-store.service';
import { Observable } from 'rxjs';
import { MeetingModel } from '../../meeting/meeting';
import { UserStoreService } from '../../profile/user-store.service';
import { User } from '../../profile/user';
import { ChatService } from '../chat.service';
import { ChatStoreService } from '../chat-store.service';
import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage {
  chat$: Observable<ChatModel>;
  meeting$: Observable<MeetingModel>;
  user$: Observable<User>;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly userStore: UserStoreService,
    private readonly chatService: ChatService,
    private readonly chatStore: ChatStoreService,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
    this.chat$ = chatStore.data$;
  }

  sendMessage(message) {
    this.chatService.sendMessage(message);
  }

  loadOlderMessages() {
    const oldestMessageDate = moment(this.chatStore.data.messages[0].date)
      .add(-1, 'milliseconds')
      .toDate();
    const weekFromOldest = moment(oldestMessageDate)
      .add(-1, 'days')
      .toDate();

    this.chatService.loadMessages(weekFromOldest, oldestMessageDate);
  }
}
