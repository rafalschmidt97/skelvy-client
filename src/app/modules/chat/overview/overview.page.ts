import { Component } from '@angular/core';
import { ChatModel } from '../chat';
import { MeetingStoreService } from '../../meeting/meeting-store.service';
import { Observable } from 'rxjs';
import { MeetingModel } from '../../meeting/meeting';
import { UserStoreService } from '../../profile/user-store.service';
import { User } from '../../profile/user';
import { ChatStoreService } from '../chat-store.service';
import { MeetingSocketService } from '../../meeting/meeting-socket.service';

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
    private readonly meetingSocket: MeetingSocketService,
    private readonly chatStore: ChatStoreService,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
    this.chat$ = chatStore.data$;
  }

  sendMessage(message) {
    this.meetingSocket.sendMessage(message);
  }
}
