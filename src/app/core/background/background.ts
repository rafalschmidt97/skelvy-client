export interface SocketNotificationMessage<T = any> {
  notification: SocketNotificationContent;
  type: SocketNotificationType;
  data: SocketNotificationData<T>;
}

export interface SocketNotificationContent {
  title: string;
  body: string;
  titleLocKey: string;
  bodyLocKey: string;
}

export enum SocketNotificationType {
  REGULAR = 'regular',
  SILENT_PUSH = 'silent_push',
  NO_PUSH = 'no_push',
}

export interface SocketNotificationData<T> {
  action: string;
  redirectTo: string;
  data: T;
}

export interface PushNotificationMessage<T = any> {
  additionalData: PushNotificationData<T>;
}

export interface PushNotificationData<T> {
  foreground: boolean;
  action: string;
  redirect_to: string;
  data: T;
}
