import { UserStateRedux } from '../../modules/user/store/user-state';
import { MeetingStateRedux } from '../../modules/meeting/store/meeting-state';
import { ChatStateRedux } from '../../modules/chat/store/chat-state';
import { GlobalStateRedux } from '../state/global-state';
import { SettingsStateRedux } from '../../modules/settings/store/settings-state';

export const state = [
  GlobalStateRedux,
  UserStateRedux,
  MeetingStateRedux,
  ChatStateRedux,
  SettingsStateRedux,
];
