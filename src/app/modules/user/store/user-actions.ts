import { SelfProfileDto, SelfUserDto } from '../user';

export class ChangeUserLoadingStatus {
  static readonly type = '[User] Change user loading status';
  constructor(public status: boolean) {}
}

export class UpdateProfile {
  static readonly type = '[User] Update profile';
  constructor(public profile: SelfProfileDto) {}
}

export class UpdateUser {
  static readonly type = '[User] Update user';
  constructor(public user: SelfUserDto) {}
}

export class UpdateUserName {
  static readonly type = '[User] Update user name';
  constructor(public name: string) {}
}

export class UpdateUserEmail {
  static readonly type = '[User] Update user email';
  constructor(public email: string) {}
}
