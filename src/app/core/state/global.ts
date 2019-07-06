export interface GlobalStateModel {
  connection: Connection;
  toRead: number;
  loadingUser: boolean;
  loadingMeeting: boolean;
}

export enum Connection {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  WAITING = 'waiting',
  DISCONNECTED = 'disconnected',
}
