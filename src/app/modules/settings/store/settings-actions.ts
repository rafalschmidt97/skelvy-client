import { FriendInvitation, MeetingInvitation, UserDto } from '../../user/user';

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

export class UpdateMeetingInvitations {
  static readonly type = '[Settings] Update meetings invitations';
  constructor(public invitations: MeetingInvitation[]) {}
}

export class AddMeetingInvitations {
  static readonly type = '[Settings] Add meeting invitations';
  constructor(public invitations: MeetingInvitation[]) {}
}

export class RemoveMeetingInvitation {
  static readonly type = '[Settings] Remove meeting invitation';
  constructor(public invitationId: number) {}
}
