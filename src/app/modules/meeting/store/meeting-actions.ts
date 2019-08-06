import { UserDto } from '../../user/user';
import { MeetingModelState } from './meeting-state';
import { MessageDto, MessageState } from '../meeting';

export class ChangeMeetingLoadingStatus {
  static readonly type = '[Meeting] Change meeting loading status';
  constructor(public status: boolean) {}
}

export class AddMeetingUser {
  static readonly type = '[Meeting] Add user';
  constructor(public user: UserDto) {}
}

export class RemoveMeetingUser {
  static readonly type = '[Meeting] Remove user';
  constructor(public userId: number) {}
}

export class UpdateMeeting {
  static readonly type = '[Meeting] Update meeting';
  constructor(public model: MeetingModelState) {}
}

export class AddChatMessagesToRead {
  static readonly type = '[Chat] Add chat messages to read';
  constructor(public amount: number) {}
}

export class UpdateChatMessagesToRead {
  static readonly type = '[Chat] Update chat messages to read';
  constructor(public amount: number) {}
}

export class AddChatMessage {
  static readonly type = '[Chat] Add message';
  constructor(public message: MessageState) {}
}

export class AddChatMessages {
  static readonly type = '[Chat] Add messages';
  constructor(public messages: MessageState[], public end = true) {}
}

export class RemoveResponseChatMessage {
  static readonly type = '[Chat] Remove response message';
  constructor(public message: MessageState) {}
}

export class RemoveOldAndAddNewResponseChatMessage {
  static readonly type = '[Chat] Remove old and add new response message';
  constructor(
    public oldMessage: MessageState,
    public newMessage: MessageState,
  ) {}
}

export class MarkResponseChatMessageAsSent {
  static readonly type = '[Chat] Mark response chat message as sent';
  constructor(public message: MessageState, public apiMessages: MessageDto[]) {}
}

export class MarkResponseChatMessageAsFailed {
  static readonly type = '[Chat] Mark response chat message as failed';
  constructor(public message: MessageState) {}
}
