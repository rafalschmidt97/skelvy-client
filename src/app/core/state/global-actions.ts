import { Connection, GlobalStateModel } from './global-state';

export class ChangeConnectionStatus {
  static readonly type = '[Global] Change connection status';
  constructor(public status: Connection) {}
}

export class MarkMeetingAsLoading {
  static readonly type = '[Global] Mark meeting as loading';
  constructor() {}
}

export class MarkMeetingAsLoaded {
  static readonly type = '[Global] Mark meeting as loaded';
  constructor() {}
}

export class MarkUserAsLoading {
  static readonly type = '[Global] Mark user as loading';
  constructor() {}
}

export class MarkUserAsLoaded {
  static readonly type = '[Global] Mark user as loaded';
  constructor() {}
}

export class AddChatMessagesToRead {
  static readonly type = '[Global] Add chat messages to read';
  constructor(public amount: number) {}
}

export class SetChatMessagesToRead {
  static readonly type = '[Global] Set chat messages to read';
  constructor(public amount: number) {}
}

export class SetGlobal {
  static readonly type = '[Global] Set global';
  constructor(public model: GlobalStateModel) {}
}
