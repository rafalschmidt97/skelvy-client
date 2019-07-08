import { UserDto } from '../../user/user';

export class UpdateBlockedUsers {
  static readonly type = '[Settings] Update blocked users';
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
