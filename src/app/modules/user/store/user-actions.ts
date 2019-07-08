import { ProfileDto, UserDto } from '../user';

export class MarkUserAsLoading {
  static readonly type = '[User] Mark user as loading';
}

export class MarkUserAsLoaded {
  static readonly type = '[User] Mark user as loaded';
}

export class UpdateProfile {
  static readonly type = '[User] Update profile';
  constructor(public profile: ProfileDto) {}
}

export class UpdateUser {
  static readonly type = '[User] Update user';
  constructor(public user: UserDto) {}
}
