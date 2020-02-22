import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { storageKeys } from '../storage/storage';
import { Subscription } from 'rxjs';
import {
  AddFriend,
  AddFriendInvitations,
  AddFriends,
  RemoveFriend,
  RemoveFriendInvitation,
  UpdateFriendInvitations,
  UpdateFriends,
  UpdateProfile,
  UpdateUser,
  UpdateUserEmail,
  UpdateUserName,
} from '../../modules/user/store/user-actions';
import { concatMap } from 'rxjs/operators';
import { UserStateModel } from '../../modules/user/store/user-state';
import { MeetingsStateModel } from '../../modules/meetings/store/meetings-state';
import {
  AddGroup,
  AddGroupMessage,
  AddGroupMessages,
  AddGroupUser,
  AddMeeting,
  AddMeetingInvitations,
  MarkResponseGroupMessageAsFailed,
  MarkResponseGroupMessageAsSent,
  RemoveGroup,
  RemoveGroupUser,
  RemoveMeeting,
  RemoveMeetingInvitation,
  RemoveResponseGroupMessage,
  UpdateGroup,
  UpdateGroupFromRequest,
  UpdateMeeting,
  UpdateMeetingFromRequest,
  UpdateMeetingInvitations,
  UpdateMeetingsState,
} from '../../modules/meetings/store/meetings-actions';

@Injectable({
  providedIn: 'root',
})
export class StateTrackerService {
  private userActions: Subscription;
  private meetingStateActions: Subscription;
  private meetingActions: Subscription;
  private groupActions: Subscription;
  private friendActions: Subscription;
  private friendInvitationsActions: Subscription;
  private meetingInvitationsActions: Subscription;

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

    this.meetingStateActions = this.actions
      .pipe(
        ofActionSuccessful(UpdateMeetingsState),
        concatMap(() => this.store.selectOnce(state => state.meetings)),
      )
      .subscribe(async (meetings: MeetingsStateModel) => {
        await this.storage.set(storageKeys.meetings, meetings.meetings);
        await this.storage.set(storageKeys.requests, meetings.requests);
        await this.storage.set(storageKeys.groups, meetings.groups);
      });

    this.meetingActions = this.actions
      .pipe(
        ofActionSuccessful(
          AddMeeting,
          RemoveMeeting,
          UpdateMeeting,
          UpdateMeetingFromRequest,
        ),
        concatMap(() => this.store.selectOnce(state => state.meetings)),
      )
      .subscribe(async (meetings: MeetingsStateModel) => {
        await this.storage.set(storageKeys.meetings, meetings.meetings);
      });

    this.groupActions = this.actions
      .pipe(
        ofActionSuccessful(
          AddGroup,
          AddGroupUser,
          RemoveGroupUser,
          RemoveGroup,
          UpdateGroup,
          UpdateGroupFromRequest,
          AddGroupMessage,
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
        concatMap(() => this.store.selectOnce(state => state.user)),
      )
      .subscribe(async (user: UserStateModel) => {
        await this.storage.set(storageKeys.friends, user.friends);
      });

    this.friendInvitationsActions = this.actions
      .pipe(
        ofActionSuccessful(
          UpdateFriendInvitations,
          AddFriendInvitations,
          RemoveFriendInvitation,
        ),
        concatMap(() => this.store.selectOnce(state => state.user)),
      )
      .subscribe(async (user: UserStateModel) => {
        await this.storage.set(
          storageKeys.friendInvitations,
          user.friendInvitations,
        );
      });

    this.meetingInvitationsActions = this.actions
      .pipe(
        ofActionSuccessful(
          UpdateMeetingInvitations,
          AddMeetingInvitations,
          RemoveMeetingInvitation,
        ),
        concatMap(() => this.store.selectOnce(state => state.meetings)),
      )
      .subscribe(async (meetings: MeetingsStateModel) => {
        await this.storage.set(
          storageKeys.meetingInvitations,
          meetings.meetingInvitations,
        );
      });
  }

  stop() {
    if (this.userActions) {
      this.userActions.unsubscribe();
    }

    if (this.meetingStateActions) {
      this.meetingStateActions.unsubscribe();
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

    if (this.friendInvitationsActions) {
      this.friendInvitationsActions.unsubscribe();
    }

    if (this.meetingInvitationsActions) {
      this.meetingInvitationsActions.unsubscribe();
    }
  }
}
