import { Component } from '@angular/core';
import { MeetingModel } from '../meeting';
import { MeetingStoreService } from '../meeting-store.service';
import { Observable } from 'rxjs';
import { UserStoreService } from '../../user/user-store.service';
import { UserModel } from '../../user/user';
import { StateStoreService } from '../../../core/state/state-store.service';
import { StateModel } from '../../../core/state/state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  meeting$: Observable<MeetingModel>;
  user$: Observable<UserModel>;
  state$: Observable<StateModel>;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly userStore: UserStoreService,
    private readonly stateStore: StateStoreService,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
    this.state$ = stateStore.data$;
  }
}
