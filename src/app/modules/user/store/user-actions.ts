import {
  FriendInvitation,
  SelfProfileDto,
  SelfUserDto,
  UserDto,
} from '../user';

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

export class UpdateFriends {
  static readonly type = '[Settings] Update friends';
  constructor(public users: UserDto[]) {}
}

export class AddFriends {
  static readonly type = '[Settings] Add friends';
  constructor(public users: UserDto[]) {}
}

export class AddFriend {
  static readonly type = '[Settings] Add friend';
  constructor(public user: UserDto) {}
}

export class RemoveFriend {
  static readonly type = '[Settings] Remove friend';
  constructor(public userId: number) {}
}

export class UpdateFriendInvitations {
  static readonly type = '[Settings] Update friend invitations';
  constructor(public invitations: FriendInvitation[]) {}
}

export class AddFriendInvitations {
  static readonly type = '[Settings] Add friend invitations';
  constructor(public invitations: FriendInvitation[]) {}
}

export class RemoveFriendInvitation {
  static readonly type = '[Settings] Remove friend invitation';
  constructor(public invitationId: number) {}
}

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
