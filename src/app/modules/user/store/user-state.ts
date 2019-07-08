import { UserDto } from '../user';
import { Action, State, StateContext } from '@ngxs/store';
import {
  ChangeUserLoadingStatus,
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
}
