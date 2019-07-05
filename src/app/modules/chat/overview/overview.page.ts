import { Component } from '@angular/core';
import { ChatStateModel } from '../chat';
import { MeetingState } from '../../meeting/meeting-state';
import { Observable } from 'rxjs';
import { MeetingStateModel } from '../../meeting/meeting';
import { UserState } from '../../user/user-state';
import { UserStateModel } from '../../user/user';
import { ChatState } from '../chat-state';
import { GlobalStateModel } from '../../../core/state/global';
import { GlobalState } from '../../../core/state/global-state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  chat$: Observable<ChatStateModel>;
  meeting$: Observable<MeetingStateModel>;
  user$: Observable<UserStateModel>;
  state$: Observable<GlobalStateModel>;

  constructor(
    private readonly meetingState: MeetingState,
    private readonly userState: UserState,
    private readonly chatState: ChatState,
    private readonly globalState: GlobalState,
  ) {
    this.meeting$ = meetingState.data$;
    this.user$ = userState.data$;
    this.chat$ = chatState.data$;
    this.state$ = globalState.data$;
  }
}
