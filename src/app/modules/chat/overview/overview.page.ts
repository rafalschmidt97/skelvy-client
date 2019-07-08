import { Component } from '@angular/core';
import { MeetingStateModel } from '../../meeting/store/meeting-state';
import { Observable } from 'rxjs';
import { UserStateModel } from '../../user/store/user-state';
import { GlobalStateModel } from '../../../core/state/global-state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @Select(state => state.meeting) meeting$: Observable<MeetingStateModel>;
  @Select(state => state.user) user$: Observable<UserStateModel>;
  @Select(state => state.global) global$: Observable<GlobalStateModel>;
}
