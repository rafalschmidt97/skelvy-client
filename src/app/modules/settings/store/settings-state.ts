import { Injectable } from '@angular/core';
import { UserDto } from '../../user/user';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddBlockedUser,
  AddBlockedUsers,
  RemoveBlockedUser,
  SetBlockedUsers,
  SetSettings,
} from './settings-actions';

export interface SettingsStateModel {
  blockedUsers: UserDto[];
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: null,
})
export class SettingsStateRedux {
  @Action(SetBlockedUsers)
  setBlockedUsers(
    { getState, setState }: StateContext<SettingsStateModel>,
    { users }: SetBlockedUsers,
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

  @Action(SetSettings)
  set({ setState }: StateContext<SettingsStateModel>, { model }: SetSettings) {
    setState(model);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SettingsState {
  constructor(private readonly store: Store) {}

  setBlockedUsers(users: UserDto[]) {
    this.store.dispatch(new SetBlockedUsers(users));
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

  set(model: SettingsStateModel) {
    this.store.dispatch(new SetSettings(model));
  }

  get data(): SettingsStateModel {
    return this.store.selectSnapshot(state => state.settings);
  }

  get data$(): Observable<SettingsStateModel> {
    return this.store.select(state => state.settings);
  }
}
