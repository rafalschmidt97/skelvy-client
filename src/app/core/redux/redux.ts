import { UserState, UserStateModel } from '../../modules/user/store/user-state';
import {
  MeetingsState,
  MeetingsStateModel,
} from '../../modules/meetings/store/meetings-state';
import {
  Connection,
  GlobalState,
  GlobalStateModel,
} from '../state/global-state';
import { getActionTypeFromInstance } from '@ngxs/store';
import {
  ExploreState,
  ExploreStateModel,
} from '../../modules/explore/store/explore-state';

export interface AppStateModel {
  global: GlobalStateModel;
  user: UserStateModel;
  meetings: MeetingsStateModel;
  explore: ExploreStateModel;
}

export const appState = [GlobalState, UserState, MeetingsState, ExploreState];

export class ClearState {
  static readonly type = '[App] Clear state';
}

export function clearState(state: AppStateModel, action, next) {
  if (getActionTypeFromInstance(action) === ClearState.type) {
    state = {
      global: {
        connection: Connection.DISCONNECTED,
      },
      user: {
        loading: false,
        user: null,
        friends: [],
        blockedUsers: [],
        friendInvitations: [],
      },
      meetings: {
        loading: false,
        meetings: [],
        requests: [],
        groups: [],
        meetingInvitations: [],
      },
      explore: {
        loading: false,
        meetings: [],
        requests: [],
      },
    };
  }

  return next(state, action);
}
