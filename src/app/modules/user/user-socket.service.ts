import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { _ } from '../../core/i18n/translate';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@aspnet/signalr';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { MeetingSocketService } from '../meeting/meeting-socket.service';

@Injectable({
  providedIn: 'root',
})
export class UserSocketService {
  private readonly socket: HubConnection;
  private initialized: boolean;
  private disconnecting: boolean;

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly meetingSocket: MeetingSocketService,
  ) {
    this.socket = new HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'users', {
        accessTokenFactory: async () => {
          const auth = await this.sessionService.getSession();
          return auth.accessToken;
        },
        logger: LogLevel.Error,
      })
      .build();

    this.meetingSocket.socket = this.socket;
  }

  connect() {
    if (!this.initialized) {
      this.meetingSocket.onMeetingActions();
      this.onClose();
      this.connectToSocket();

      this.initialized = true;
    } else {
      if (this.socket.state === HubConnectionState.Disconnected) {
        this.connectToSocket();
      } else {
        this.socket
          .stop()
          .then(() => {
            this.connectToSocket();
          })
          .catch(() => {
            this.toastService.createError(
              _('A problem occurred while reconnecting to the server'),
            );
          });
      }
    }
  }

  disconnect() {
    if (this.socket.state === HubConnectionState.Connected) {
      this.disconnecting = true;
      this.socket.stop().catch(() => {
        this.toastService.createError(
          _('A problem occurred while disconnecting from the server'),
        );
      });
    }
  }

  private onClose() {
    this.socket.onclose(() => {
      if (!this.disconnecting) {
        this.toastService.createWarning(_('The connection has been lost'));
      }
      this.disconnecting = false;
    });
  }

  private connectToSocket() {
    this.socket
      .start()
      .then(() => {})
      .catch(() => {
        this.toastService.createError(
          _('A problem occurred while connecting to the server'),
        );
      });
  }
}
