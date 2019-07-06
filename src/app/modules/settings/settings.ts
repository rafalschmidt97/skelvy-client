import { UserDto } from '../user/user';

export interface SettingsStateModel {
  blockedUsers: UserDto[];
}
