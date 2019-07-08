import { ProfileDto, UserDto } from '../user';

export class ChangeUserLoadingStatus {
  static readonly type = '[User] Change user loading status';
  constructor(public status: boolean) {}
}

export class UpdateProfile {
  static readonly type = '[User] Update profile';
  constructor(public profile: ProfileDto) {}
}

export class UpdateUser {
  static readonly type = '[User] Update user';
  constructor(public user: UserDto) {}
}
