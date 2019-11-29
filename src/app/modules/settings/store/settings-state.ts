import { FriendInvitation, MeetingInvitation, UserDto } from '../../user/user';
import { Action, State, StateContext } from '@ngxs/store';
import {
  AddFriend,
  AddFriendInvitations,
  AddFriends,
  AddMeetingInvitations,
  RemoveFriend,
  RemoveFriendInvitation,
  RemoveMeetingInvitation,
  UpdateFriendInvitations,
  UpdateFriends,
  UpdateMeetingInvitations,
} from './settings-actions';

export interface SettingsStateModel {
  friends: UserDto[];
  friendInvitations: FriendInvitation[];
  meetingInvitations: MeetingInvitation[];
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    friends: [],
    friendInvitations: [],
    meetingInvitations: [],
  },
})
export class SettingsState {
  @Action(UpdateFriends)
  updateFriends(
    { getState, setState }: StateContext<SettingsStateModel>,
    { users }: UpdateFriends,
  ) {
    const state = getState();
    setState({
      ...state,
      friends: users,
    });
  }

  @Action(AddFriends)
  addFriends(
    { getState, setState }: StateContext<SettingsStateModel>,
    { users }: AddFriends,
  ) {
    const state = getState();
    setState({
      ...state,
      friends: [...state.friends, ...users],
    });
  }

  @Action(AddFriend)
  addFriend(
    { getState, setState }: StateContext<SettingsStateModel>,
    { user }: AddFriend,
  ) {
    const state = getState();
    setState({
      ...state,
      friends: [...state.friends, user],
    });
  }

  @Action(RemoveFriend)
  removeFriend(
    { getState, setState }: StateContext<SettingsStateModel>,
    { userId }: RemoveFriend,
  ) {
    const state = getState();
    setState({
      ...state,
      friends: state.friends.filter(x => x.id !== userId),
    });
  }

  @Action(UpdateFriendInvitations)
  updateFriendInvitations(
    { getState, setState }: StateContext<SettingsStateModel>,
    { invitations }: UpdateFriendInvitations,
  ) {
    const state = getState();
    setState({
      ...state,
      friendInvitations: invitations,
    });
  }

  @Action(AddFriendInvitations)
  addFriendInvitations(
    { getState, setState }: StateContext<SettingsStateModel>,
    { invitations }: AddFriendInvitations,
  ) {
    const state = getState();
    setState({
      ...state,
      friendInvitations: [...state.friendInvitations, ...invitations],
    });
  }

  @Action(RemoveFriendInvitation)
  removeFriendInvitation(
    { getState, setState }: StateContext<SettingsStateModel>,
    { invitationId }: RemoveFriendInvitation,
  ) {
    const state = getState();
    setState({
      ...state,
      friendInvitations: state.friendInvitations.filter(
        x => x.id !== invitationId,
      ),
    });
  }

  @Action(UpdateMeetingInvitations)
  updateMeetingInvitations(
    { getState, setState }: StateContext<SettingsStateModel>,
    { invitations }: UpdateMeetingInvitations,
  ) {
    const state = getState();
    setState({
      ...state,
      meetingInvitations: invitations,
    });
  }

  @Action(AddMeetingInvitations)
  addMeetingInvitations(
    { getState, setState }: StateContext<SettingsStateModel>,
    { invitations }: AddMeetingInvitations,
  ) {
    const state = getState();
    setState({
      ...state,
      meetingInvitations: [...state.meetingInvitations, ...invitations],
    });
  }

  @Action(RemoveMeetingInvitation)
  removeMeetingInvitation(
    { getState, setState }: StateContext<SettingsStateModel>,
    { invitationId }: RemoveMeetingInvitation,
  ) {
    const state = getState();
    setState({
      ...state,
      meetingInvitations: state.meetingInvitations.filter(
        x => x.id !== invitationId,
      ),
    });
  }
}
