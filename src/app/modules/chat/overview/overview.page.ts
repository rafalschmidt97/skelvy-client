import { Component } from '@angular/core';
import { ChatModel } from '../chat';
import { MeetingStoreService } from '../../meeting/meeting-store.service';
import { Observable } from 'rxjs';
import { MeetingModel } from '../../meeting/meeting';
import { UserStoreService } from '../../user/user-store.service';
import { UserModel } from '../../user/user';
import { ChatStoreService } from '../chat-store.service';
import { StateModel } from '../../../core/state/state';
import { StateStoreService } from '../../../core/state/state-store.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  chat$: Observable<ChatModel>;
  meeting$: Observable<MeetingModel>;
  user$: Observable<UserModel>;
  state$: Observable<StateModel>;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly userStore: UserStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly stateStore: StateStoreService,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
    this.chat$ = chatStore.data$;
    this.state$ = stateStore.data$;
  }
}
