export interface StateModel {
  loggedIn: boolean;
  connection: Connection;
  toRead: number;
  loadingUser: boolean;
  loadingMeeting: boolean;
}

export enum Connection {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  DISCONNECTED = 'disconnected',
}
