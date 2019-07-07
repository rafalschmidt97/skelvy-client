import { UserDto } from '../../user/user';
import { MeetingStateModel } from './meeting-state';

export class AddMeetingUser {
  static readonly type = '[Meeting] Add user';
  constructor(public user: UserDto) {}
}

export class RemoveMeetingUser {
  static readonly type = '[Meeting] Remove user';
  constructor(public userId: number) {}
}

export class SetMeeting {
  static readonly type = '[Meeting] Set meeting';
  constructor(public model: MeetingStateModel) {}
}
