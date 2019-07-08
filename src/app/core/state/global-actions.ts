import { Connection, GlobalStateModel } from './global-state';

export class ChangeConnectionStatus {
  static readonly type = '[Global] Change connection status';
  constructor(public status: Connection) {}
}

export class SetGlobal {
  static readonly type = '[Global] Set global';
  constructor(public model: GlobalStateModel) {}
}
