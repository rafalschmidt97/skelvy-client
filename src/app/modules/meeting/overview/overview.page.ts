import { Component } from '@angular/core';
import { MeetingState, MeetingStateModel } from '../store/meeting-state';
import { Observable } from 'rxjs';
import { UserState, UserStateModel } from '../../user/store/user-state';
import {
  GlobalState,
  GlobalStateModel,
} from '../../../core/state/global-state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  meeting$: Observable<MeetingStateModel>;
  user$: Observable<UserStateModel>;
  state$: Observable<GlobalStateModel>;

  constructor(
    private readonly meetingState: MeetingState,
    private readonly userState: UserState,
    private readonly globalState: GlobalState,
  ) {
    this.meeting$ = meetingState.data$;
    this.user$ = userState.data$;
    this.state$ = globalState.data$;
  }
}
