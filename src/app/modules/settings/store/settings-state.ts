import { Injectable } from '@angular/core';
import { UserDto } from '../../user/user';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
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
export class SettingsStateRedux {
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

@Injectable({
  providedIn: 'root',
})
export class SettingsState {
  constructor(private readonly store: Store) {}

  updateBlockedUsers(users: UserDto[]) {
    this.store.dispatch(new UpdateBlockedUsers(users));
  }

  addBlockedUsers(users: UserDto[]) {
    this.store.dispatch(new AddBlockedUsers(users));
  }

  addBlockedUser(user: UserDto) {
    this.store.dispatch(new AddBlockedUser(user));
  }

  removeBlockedUser(userId: number) {
    this.store.dispatch(new RemoveBlockedUser(userId));
  }

  get data(): SettingsStateModel {
    return this.store.selectSnapshot(state => state.settings);
  }

  get data$(): Observable<SettingsStateModel> {
    return this.store.select(state => state.settings);
  }
}
