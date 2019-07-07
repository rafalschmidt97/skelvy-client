import { ProfileDto } from '../user';
import { UserStateModel } from './user-state';

export class UpdateProfile {
  static readonly type = '[User] Update profile';
  constructor(public profile: ProfileDto) {}
}

export class SetUser {
  static readonly type = '[User] Set user';
  constructor(public model: UserStateModel) {}
}
