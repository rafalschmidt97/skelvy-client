import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { storageKeys } from '../storage/storage';
import { Subscription } from 'rxjs';
import {
  UpdateProfile,
  UpdateUser,
  UpdateUserEmail,
  UpdateUserName,
} from '../../modules/user/store/user-actions';
import { concatMap } from 'rxjs/operators';
import { UserStateModel } from '../../modules/user/store/user-state';
import { MeetingsStateModel } from '../../modules/meetings/store/meetings-state';
import {
  AddGroupMessages,
  AddGroupUser,
  MarkResponseGroupMessageAsFailed,
  MarkResponseGroupMessageAsSent,
  RemoveGroupUser,
  RemoveResponseGroupMessage,
  UpdateMeetingsState,
} from '../../modules/meetings/store/meetings-actions';
import {
  AddFriend,
  AddFriends,
  RemoveFriend,
  UpdateFriends,
} from '../../modules/settings/store/settings-actions';
import { SettingsStateModel } from '../../modules/settings/store/settings-state';

@Injectable({
  providedIn: 'root',
})
export class StateTrackerService {
  private userActions: Subscription;
  private meetingActions: Subscription;
  private groupActions: Subscription;
  private friendActions: Subscription;

  constructor(
    private readonly storage: Storage,
    private readonly actions: Actions,
    private readonly store: Store,
  ) {}

  track() {
    this.userActions = this.actions
      .pipe(
        ofActionSuccessful(
          UpdateUser,
          UpdateProfile,
          UpdateUserName,
          UpdateUserEmail,
        ),
        concatMap(() => this.store.selectOnce(state => state.user)),
      )
      .subscribe(async (user: UserStateModel) => {
        await this.storage.set(storageKeys.user, user.user);
      });

    this.meetingActions = this.actions
      .pipe(
        ofActionSuccessful(UpdateMeetingsState),
        concatMap(() => this.store.selectOnce(state => state.meetings)),
      )
      .subscribe(async (meetings: MeetingsStateModel) => {
        await this.storage.set(storageKeys.meetings, meetings.meetings);
        await this.storage.set(storageKeys.requests, meetings.requests);
        await this.storage.set(storageKeys.groups, meetings.groups);
      });

    this.groupActions = this.actions
      .pipe(
        ofActionSuccessful(
          AddGroupUser,
          RemoveGroupUser,
          AddGroupMessages,
          MarkResponseGroupMessageAsSent,
          MarkResponseGroupMessageAsFailed,
          RemoveResponseGroupMessage,
        ),
        concatMap(() => this.store.selectOnce(state => state.meetings)),
      )
      .subscribe(async (meetings: MeetingsStateModel) => {
        await this.storage.set(storageKeys.groups, meetings.groups);
      });

    this.friendActions = this.actions
      .pipe(
        ofActionSuccessful(UpdateFriends, AddFriends, AddFriend, RemoveFriend),
        concatMap(() => this.store.selectOnce(state => state.settings)),
      )
      .subscribe(async (settings: SettingsStateModel) => {
        await this.storage.set(storageKeys.friends, settings.friends);
      });
  }

  stop() {
    if (this.userActions) {
      this.userActions.unsubscribe();
    }

    if (this.meetingActions) {
      this.meetingActions.unsubscribe();
    }

    if (this.groupActions) {
      this.groupActions.unsubscribe();
    }

    if (this.friendActions) {
      this.friendActions.unsubscribe();
    }
  }
}
