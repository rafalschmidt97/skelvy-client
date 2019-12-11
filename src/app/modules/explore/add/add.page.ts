import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MeetingsStateModel } from '../../meetings/store/meetings-state';
import {
  GroupState,
  GroupUserRole,
  MeetingDto,
  MeetingRequestDto,
} from '../../meetings/meetings';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage {
  @Select(state => state.meetings) $meetings: Observable<MeetingsStateModel>;

  constructor(
    private readonly routerNavigation: NavController,
    private readonly store: Store,
  ) {}

  fillPreferences(allowed: boolean) {
    if (allowed) {
      this.routerNavigation.navigateForward(['/app/meetings/edit-preferences']);
    }
  }

  addMeeting(allowed: boolean) {
    if (allowed) {
      this.routerNavigation.navigateForward(['/app/meetings/edit-meeting']);
    }
  }

  isAllowedToAddMeeting(meetings: MeetingDto[], groups: GroupState[]): boolean {
    const userId = this.getUserId();
    const ownedGroups = groups.filter(x =>
      x.users.find(y => y.id === userId && y.role === GroupUserRole.OWNER),
    );

    return (
      meetings.filter(x => ownedGroups.find(y => y.id === x.groupId)).length < 3
    );
  }

  isAllowedToFillPreferences(requests: MeetingRequestDto[]) {
    return requests.length < 3;
  }

  private getUserId(): number {
    return this.store.selectSnapshot(state => state.user.user.id);
  }
}
