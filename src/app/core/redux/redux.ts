import { UserState, UserStateModel } from '../../modules/user/store/user-state';
import {
  MeetingState,
  MeetingStateModel,
} from '../../modules/meeting/store/meeting-state';
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
  meeting: MeetingStateModel;
  settings: SettingsStateModel;
}

export const appState = [GlobalState, UserState, MeetingState, SettingsState];

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
      meeting: {
        loading: false,
        toRead: 0,
        meetingModel: null,
      },
      settings: {
        blockedUsers: null,
      },
    };
  }

  return next(state, action);
}
