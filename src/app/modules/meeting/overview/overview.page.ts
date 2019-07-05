import { Component } from '@angular/core';
import { MeetingStateModel } from '../meeting';
import { MeetingState } from '../meeting-state';
import { Observable } from 'rxjs';
import { UserState } from '../../user/user-state';
import { UserStateModel } from '../../user/user';
import { GlobalState } from '../../../core/state/global-state';
import { GlobalStateModel } from '../../../core/state/global';

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
