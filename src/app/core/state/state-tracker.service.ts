import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { storageKeys } from '../storage/storage';
import { Subscription } from 'rxjs';
import {
  UpdateProfile,
  UpdateUser,
} from '../../modules/user/store/user-actions';
import { concatMap } from 'rxjs/operators';
import { UserStateModel } from '../../modules/user/store/user-state';
import { MeetingStateModel } from '../../modules/meeting/store/meeting-state';
import {
  AddChatMessages,
  AddMeetingUser,
  MarkChatMessageAsFailed,
  MarkChatMessageAsSent,
  RemoveChatMessage,
  RemoveMeetingUser,
  UpdateMeeting,
} from '../../modules/meeting/store/meeting-actions';
import {
  AddBlockedUser,
  AddBlockedUsers,
  RemoveBlockedUser,
  UpdateBlockedUsers,
} from '../../modules/settings/store/settings-actions';
import { SettingsStateModel } from '../../modules/settings/store/settings-state';

@Injectable({
  providedIn: 'root',
})
export class StateTrackerService {
  private userActions: Subscription;
  private meetingActions: Subscription;
  private blockedUsersActions: Subscription;

  constructor(
    private readonly storage: Storage,
    private readonly actions: Actions,
    private readonly store: Store,
  ) {}

  track() {
    this.userActions = this.actions
      .pipe(
        ofActionSuccessful(UpdateUser, UpdateProfile),
        concatMap(() => this.store.selectOnce(state => state.user)),
      )
      .subscribe(async (user: UserStateModel) => {
        await this.storage.set(storageKeys.user, user.user);
      });

    this.meetingActions = this.actions
      .pipe(
        ofActionSuccessful(
          UpdateMeeting,
          AddMeetingUser,
          RemoveMeetingUser,
          AddChatMessages,
          MarkChatMessageAsSent,
          MarkChatMessageAsFailed,
          RemoveChatMessage,
        ),
        concatMap(() => this.store.selectOnce(state => state.meeting)),
      )
      .subscribe(async (meeting: MeetingStateModel) => {
        await this.storage.set(storageKeys.meeting, meeting.meetingModel);
      });

    this.blockedUsersActions = this.actions
      .pipe(
        ofActionSuccessful(
          UpdateBlockedUsers,
          AddBlockedUsers,
          AddBlockedUser,
          RemoveBlockedUser,
        ),
        concatMap(() => this.store.selectOnce(state => state.settings)),
      )
      .subscribe(async (settings: SettingsStateModel) => {
        await this.storage.set(storageKeys.blockedUsers, settings.blockedUsers);
      });
  }

  stop() {
    this.userActions.unsubscribe();
    this.meetingActions.unsubscribe();
    this.blockedUsersActions.unsubscribe();
  }
}
