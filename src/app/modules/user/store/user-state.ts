import { Injectable } from '@angular/core';
import { ProfileDto, UserDto } from '../user';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  MarkUserAsLoaded,
  MarkUserAsLoading,
  UpdateProfile,
  UpdateUser,
} from './user-actions';

export interface UserStateModel {
  loading: boolean;
  user: UserDto;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    loading: false,
    user: null,
  },
})
export class UserStateRedux {
  @Action(MarkUserAsLoading)
  markUserAsLoading({ getState, setState }: StateContext<UserStateModel>) {
    const state = getState();
    setState({
      ...state,
      loading: true,
    });
  }

  @Action(MarkUserAsLoaded)
  markUserAsLoaded({ getState, setState }: StateContext<UserStateModel>) {
    const state = getState();
    setState({
      ...state,
      loading: false,
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
}

@Injectable({
  providedIn: 'root',
})
export class UserState {
  constructor(private readonly store: Store) {}

  markAsLoading() {
    this.store.dispatch(new MarkUserAsLoading());
  }

  markAsLoaded() {
    this.store.dispatch(new MarkUserAsLoaded());
  }

  updateProfile(profile: ProfileDto) {
    this.store.dispatch(new UpdateProfile(profile));
  }

  updateUser(user: UserDto) {
    this.store.dispatch(new UpdateUser(user));
  }

  get data(): UserStateModel {
    return this.store.selectSnapshot(state => state.user);
  }

  get data$(): Observable<UserStateModel> {
    return this.store.select(state => state.user);
  }
}
