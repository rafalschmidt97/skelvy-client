import {
  ActivityDto,
  GroupDto,
  GroupUserDto,
  GroupUserRole,
  MeetingDto,
  MeetingRequest,
  MeetingRequestDto,
  MessageDto,
  MessageState,
} from '../meetings';

export class ChangeMeetingLoadingStatus {
  static readonly type = '[Meetings] Change meeting loading status';
  constructor(public status: boolean) {}
}

export class AddGroupUser {
  static readonly type = '[Groups] Add user';
  constructor(public groupId: number, public user: GroupUserDto) {}
}

export class RemoveGroupUser {
  static readonly type = '[Groups] Remove user';
  constructor(public groupId: number, public userId: number) {}
}

export class UpdateMeetingsState {
  static readonly type = '[Meetings] Update meetings';
  constructor(
    public meetings: MeetingDto[],
    public requests: MeetingRequestDto[],
    public groups: GroupDto[],
  ) {}
}

export class UpdateMeetingsFromModel {
  static readonly type = '[Meetings] Update meetings from model';
  constructor(public meetings: MeetingDto[], public groups: GroupDto[]) {}
}

export class UpdateMeeting {
  static readonly type = '[Meetings] Update meeting';
  constructor(public meeting: MeetingDto) {}
}

export class UpdateMeetingFromRequest {
  static readonly type = '[Meetings] Update meeting from request';
  constructor(
    public meetingId: number,
    public meetingRequest: MeetingRequest,
    public resolvedActivity: ActivityDto,
    public resolvedCity: string,
  ) {}
}

export class UpdateMeetingUserRole {
  static readonly type = '[Meetings] Update meeting user role';
  constructor(
    public groupId: number,
    public userId: number,
    public role: GroupUserRole,
  ) {}
}

export class UpdateRequests {
  static readonly type = '[Meetings] Update requests';
  constructor(public requests: MeetingRequestDto[]) {}
}

export class AddMeeting {
  static readonly type = '[Meetings] Add meeting';
  constructor(public meeting: MeetingDto) {}
}

export class AddGroup {
  static readonly type = '[Meetings] Add group';
  constructor(public group: GroupDto) {}
}

export class AddGroupMessage {
  static readonly type = '[Groups] Add message';
  constructor(public groupId: number, public message: MessageState) {}
}

export class AddGroupMessages {
  static readonly type = '[Groups] Add messages';
  constructor(
    public groupId: number,
    public messages: MessageState[],
    public end = true,
  ) {}
}

export class RemoveResponseGroupMessage {
  static readonly type = '[Groups] Remove response message';
  constructor(public groupId: number, public message: MessageState) {}
}

export class RemoveOldAndAddNewResponseGroupMessage {
  static readonly type = '[Groups] Remove old and add new response message';
  constructor(
    public groupId: number,
    public oldMessage: MessageState,
    public newMessage: MessageState,
  ) {}
}

export class MarkResponseGroupMessageAsSent {
  static readonly type = '[Groups] Mark response chat message as sent';
  constructor(
    public groupId: number,
    public message: MessageState,
    public apiMessages: MessageDto[],
  ) {}
}

export class MarkResponseGroupMessageAsFailed {
  static readonly type = '[Groups] Mark response chat message as failed';
  constructor(public groupId: number, public message: MessageState) {}
}

export class RemoveMeeting {
  static readonly type = '[Meetings] Remove meeting';
  constructor(public meetingId: number) {}
}

export class RemoveRequest {
  static readonly type = '[Requests] Remove request';
  constructor(public requestId: number) {}
}

export class RemoveGroup {
  static readonly type = '[Groups] Remove group';
  constructor(public groupId: number) {}
}
