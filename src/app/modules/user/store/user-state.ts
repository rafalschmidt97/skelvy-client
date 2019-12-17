import { FriendInvitation, SelfUserDto, UserDto } from '../user';
import { Action, State, StateContext } from '@ngxs/store';
import {
  AddBlockedUser,
  AddBlockedUsers,
  AddFriend,
  AddFriendInvitations,
  AddFriends,
  ChangeUserLoadingStatus,
  RemoveBlockedUser,
  RemoveFriend,
  RemoveFriendInvitation,
  UpdateBlockedUsers,
  UpdateFriendInvitations,
  UpdateFriends,
  UpdateProfile,
  UpdateUser,
  UpdateUserEmail,
  UpdateUserName,
} from './user-actions';

export interface UserStateModel {
  loading: boolean;
  user: SelfUserDto;
  friends: UserDto[];
  blockedUsers: UserDto[];
  friendInvitations: FriendInvitation[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    loading: false,
    user: null,
    friends: [],
    blockedUsers: [],
    friendInvitations: [],
  },
})
export class UserState {
  @Action(ChangeUserLoadingStatus)
  changeUserLoadingStatus(
    { getState, setState }: StateContext<UserStateModel>,
    { status }: ChangeUserLoadingStatus,
  ) {
    const state = getState();
    setState({
      ...state,
      loading: status,
    });
  }

  @Action(UpdateProfile)
  updateProfile(
    { getState, setState }: StateContext<UserStateModel>,
    { profile }: UpdateProfile,
  ) {
    const state = getState();
    setState({
      ...state,
      user: {
        ...state.user,
        profile,
      },
    });
  }

  @Action(UpdateUser)
  updateUser(
    { getState, setState }: StateContext<UserStateModel>,
    { user }: UpdateUser,
  ) {
    const state = getState();
    setState({
      ...state,
      user,
    });
  }

  @Action(UpdateUserName)
  updateUserName(
    { getState, setState }: StateContext<UserStateModel>,
    { name }: UpdateUserName,
  ) {
    const state = getState();
    setState({
      ...state,
      user: {
        ...state.user,
        name,
      },
    });
  }

  @Action(UpdateUserEmail)
  updateUserEmail(
    { getState, setState }: StateContext<UserStateModel>,
    { email }: UpdateUserEmail,
  ) {
    const state = getState();
    setState({
      ...state,
      user: {
        ...state.user,
        email,
      },
    });
  }

  @Action(UpdateFriends)
  updateFriends(
    { getState, setState }: StateContext<UserStateModel>,
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
    { getState, setState }: StateContext<UserStateModel>,
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
    { getState, setState }: StateContext<UserStateModel>,
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
    { getState, setState }: StateContext<UserStateModel>,
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
    { getState, setState }: StateContext<UserStateModel>,
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
    { getState, setState }: StateContext<UserStateModel>,
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
    { getState, setState }: StateContext<UserStateModel>,
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

  @Action(UpdateBlockedUsers)
  updateBlockedUsers(
    { getState, setState }: StateContext<UserStateModel>,
    { users }: UpdateBlockedUsers,
  ) {
    const state = getState();
    setState({
      ...state,
      blockedUsers: users,
    });
  }

  @Action(AddBlockedUsers)
  addBlockedUsers(
    { getState, setState }: StateContext<UserStateModel>,
    { users }: AddBlockedUsers,
  ) {
    const state = getState();
    setState({
      ...state,
      blockedUsers: [...state.blockedUsers, ...users],
    });
  }

  @Action(AddBlockedUser)
  addBlockedUser(
    { getState, setState }: StateContext<UserStateModel>,
    { user }: AddBlockedUser,
  ) {
    const state = getState();
    setState({
      ...state,
      blockedUsers: [...state.blockedUsers, user],
    });
  }

  @Action(RemoveBlockedUser)
  removeBlockedUser(
    { getState, setState }: StateContext<UserStateModel>,
    { userId }: RemoveBlockedUser,
  ) {
    const state = getState();
    setState({
      ...state,
      blockedUsers: state.blockedUsers.filter(x => x.id !== userId),
    });
  }
}
