import { Component } from '@angular/core';
import { MeetingsStateModel } from '../store/meetings-state';
import { Observable } from 'rxjs';
import { UserStateModel } from '../../user/store/user-state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-overview',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage {
  @Select(state => state.meetings) $meetings: Observable<MeetingsStateModel>;
  @Select(state => state.user) user$: Observable<UserStateModel>;
}
