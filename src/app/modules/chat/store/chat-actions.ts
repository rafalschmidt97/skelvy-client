import { ChatStateModel } from './chat-state';
import { ChatMessageState } from '../chat';

export class AddChatMessage {
  static readonly type = '[Chat] Add message';
  constructor(public message: ChatMessageState) {}
}

export class RemoveChatMessage {
  static readonly type = '[Chat] Remove message';
  constructor(public message: ChatMessageState) {}
}

export class RemoveOldAndAddNewChatMessage {
  static readonly type = '[Chat] Remove old and add new message';
  constructor(
    public oldMessage: ChatMessageState,
    public newMessage: ChatMessageState,
  ) {}
}

export class MarkChatMessageAsSent {
  static readonly type = '[Chat] Mark chat message as sent';
  constructor(public message: ChatMessageState) {}
}

export class MarkChatMessageAsFailed {
  static readonly type = '[Chat] Mark chat message as failed';
  constructor(public message: ChatMessageState) {}
}

export class SetChatMessages {
  static readonly type = '[Chat] Set chat messages';
  constructor(public messages: ChatMessageState[]) {}
}

export class SetChat {
  static readonly type = '[Chat] Set chat';
  constructor(public model: ChatStateModel) {}
}
