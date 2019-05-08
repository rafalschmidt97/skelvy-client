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
import { AuthService } from '../../core/auth/auth.service';
import { NavController } from '@ionic/angular';
import { UserStoreService } from './user-store.service';

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
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly userStore: UserStoreService,
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
      this.onUserRemoved();
      this.onUserDisabled();
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
            this.userStore.reconnect();
            setTimeout(() => this.reconnectToSocket(), 5000);
          });
      }
    }
  }

  disconnect() {
    if (this.socket.state === HubConnectionState.Connected) {
      this.socket
        .stop()
        .then(() => {
          this.userStore.disconnect();
          this.disconnecting = true;
        })
        .catch(() => {
          this.toastService.createError(
            _('A problem occurred while disconnecting from the server'),
          );
        });
    }
  }

  private onClose() {
    this.socket.onclose(() => {
      if (!this.disconnecting) {
        this.userStore.reconnect();
        setTimeout(() => this.reconnectToSocket(), 5000);
      } else {
        this.userStore.disconnect();
        this.disconnecting = false;
      }
    });
  }

  private onUserRemoved() {
    this.socket.on('UserRemoved', () => {
      this.authService.logoutWithoutRequest().then(() => {
        this.routerNavigation.navigateBack(['/home/sign-in']);
        this.toastService.createError(
          _(
            `Your account has been removed. If you have any questions, don't hesitate to contact us by using our website`,
          ),
        );
      });
    });
  }

  private onUserDisabled() {
    this.socket.on('UserDisabled', () => {
      this.authService.logoutWithoutRequest().then(() => {
        this.routerNavigation.navigateBack(['/home/sign-in']);
        this.toastService.createError(
          _(
            `Your account has been disabled. If you have any questions, don't hesitate to contact us by using our website`,
          ),
        );
      });
    });
  }

  private connectToSocket() {
    this.socket
      .start()
      .then(() => {
        this.userStore.connect();
      })
      .catch(() => {
        this.toastService.createError(
          _('A problem occurred while connecting to the server'),
        );
      });
  }

  private reconnectToSocket() {
    this.socket
      .start()
      .then(() => {
        this.userStore.connect();
      })
      .catch(() => {
        this.userStore.disconnect();
        setTimeout(() => this.reconnectToSocket(), 5000);
      });
  }
}
