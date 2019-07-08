import {
  UserStateModel,
  UserStateRedux,
} from '../../modules/user/store/user-state';
import {
  MeetingStateModel,
  MeetingStateRedux,
} from '../../modules/meeting/store/meeting-state';
import {
  Connection,
  GlobalStateModel,
  GlobalStateRedux,
} from '../state/global-state';
import {
  SettingsStateModel,
  SettingsStateRedux,
} from '../../modules/settings/store/settings-state';
import { getActionTypeFromInstance } from '@ngxs/store';

export interface AppStateModel {
  global: GlobalStateModel;
  user: UserStateModel;
  meeting: MeetingStateModel;
  settings: SettingsStateModel;
}

export const appState = [
  GlobalStateRedux,
  UserStateRedux,
  MeetingStateRedux,
  SettingsStateRedux,
];

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
        meeting: null,
      },
      settings: {
        blockedUsers: null,
      },
    };
  }

  return next(state, action);
}
