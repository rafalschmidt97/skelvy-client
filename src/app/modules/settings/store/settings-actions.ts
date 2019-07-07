import { UserDto } from '../../user/user';
import { SettingsStateModel } from './settings-state';

export class SetBlockedUsers {
  static readonly type = '[Settings] Set blocked users';
  constructor(public users: UserDto[]) {}
}

export class AddBlockedUsers {
  static readonly type = '[Settings] Add blocked users';
  constructor(public users: UserDto[]) {}
}

export class AddBlockedUser {
  static readonly type = '[Settings] Add blocked user';
  constructor(public user: UserDto) {}
}

export class RemoveBlockedUser {
  static readonly type = '[Settings] Remove blocked user';
  constructor(public userId: number) {}
}

export class SetSettings {
  static readonly type = '[Settings] Set settings';
  constructor(public model: SettingsStateModel) {}
}
