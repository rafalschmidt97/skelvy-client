import { Injectable } from '@angular/core';
import { ProfileDto } from '../user';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { SetUser, UpdateProfile } from './user-actions';
import { Observable } from 'rxjs';

export interface UserStateModel {
  id: number;
  profile: ProfileDto;
}

@State<UserStateModel>({
  name: 'user',
  defaults: null,
})
export class UserStateRedux {
  @Action(UpdateProfile)
  updateProfile(
    { getState, setState }: StateContext<UserStateModel>,
    { profile }: UpdateProfile,
  ) {
    const state = getState();
    setState({
      ...state,
      profile,
    });
  }

  @Action(SetUser)
  set({ setState }: StateContext<UserStateModel>, { model }: SetUser) {
    setState(model);
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserState {
  constructor(private readonly store: Store) {}

  updateProfile(profile: ProfileDto) {
    this.store.dispatch(new UpdateProfile(profile));
  }

  set(model: UserStateModel) {
    this.store.dispatch(new SetUser(model));
  }

  get data(): UserStateModel {
    return this.store.selectSnapshot(state => state.user);
  }

  get data$(): Observable<UserStateModel> {
    return this.store.select(state => state.user);
  }
}
