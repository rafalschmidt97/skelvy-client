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
import {
  SettingsState,
  SettingsStateModel,
} from '../../modules/settings/store/settings-state';
import { getActionTypeFromInstance } from '@ngxs/store';

export interface AppStateModel {
  global: GlobalStateModel;
  user: UserStateModel;
  meetings: MeetingsStateModel;
  settings: SettingsStateModel;
}

export const appState = [GlobalState, UserState, MeetingsState, SettingsState];

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
      },
      meetings: {
        loading: false,
        meetings: [],
        requests: [],
        groups: [],
      },
      settings: {
        friends: [],
        friendInvitations: [],
        meetingInvitations: [],
      },
    };
  }

  return next(state, action);
}
