import { UserDto } from '../../user/user';
import { Action, State, StateContext } from '@ngxs/store';
import {
  AddBlockedUser,
  AddBlockedUsers,
  RemoveBlockedUser,
  UpdateBlockedUsers,
} from './settings-actions';

export interface SettingsStateModel {
  blockedUsers: UserDto[];
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    blockedUsers: null,
  },
})
export class SettingsState {
  @Action(UpdateBlockedUsers)
  updateBlockedUsers(
    { getState, setState }: StateContext<SettingsStateModel>,
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
    { getState, setState }: StateContext<SettingsStateModel>,
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
    { getState, setState }: StateContext<SettingsStateModel>,
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
    { getState, setState }: StateContext<SettingsStateModel>,
    { userId }: RemoveBlockedUser,
  ) {
    const state = getState();
    setState({
      ...state,
      blockedUsers: state.blockedUsers.filter(x => x.id !== userId),
    });
  }
}
