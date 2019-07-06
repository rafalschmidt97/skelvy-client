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
import { UserState } from './user-state';
import { MeetingService } from '../meeting/meeting.service';
import { GlobalState } from '../../core/state/global-state';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserSocketService {
  private readonly socket: HubConnection;
  private initialized = false;
  private disconnected = true;
  private reconnectFailedAttempts = 0;

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly meetingSocket: MeetingSocketService,
    private readonly meetingService: MeetingService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly userState: UserState,
    private readonly globalState: GlobalState,
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

      this.initialized = true;
    }

    this.connectToSocket();
  }

  disconnect() {
    if (this.socket.state === HubConnectionState.Connected) {
      this.disconnected = true;

      this.socket
        .stop()
        .then(() => {
          this.globalState.disconnect();
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
      if (!this.disconnected) {
        this.globalState.reconnect();
        this.reconnectToSocket();
      } else {
        this.globalState.disconnect();
        this.disconnected = true;
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
        this.globalState.connect();
        this.disconnected = false;
      })
      .catch(error => {
        this.globalState.reconnect();

        if (error.statusCode === 401) {
          this.authService
            .refreshToken()
            .pipe(
              tap(() => {
                this.reconnectToSocket();
              }),
            )
            .subscribe();
        } else {
          setTimeout(() => this.reconnectToSocket(), 1000);
        }
      });
  }

  private reconnectToSocket() {
    if (this.socket.state !== HubConnectionState.Connected) {
      this.socket
        .start()
        .then(() => {
          this.reconnectFailedAttempts = 0;
          this.globalState.connect();
          this.disconnected = false;
          this.meetingService.findMeeting().subscribe();
        })
        .catch(error => {
          if (this.reconnectFailedAttempts < 4) {
            this.reconnectFailedAttempts++;

            if (this.reconnectFailedAttempts === 1) {
              this.globalState.reconnect();
            }
          } else {
            this.globalState.waiting();
          }

          if (error.statusCode === 401) {
            this.authService
              .refreshToken()
              .pipe(
                tap(() => {
                  this.reconnectToSocket();
                }),
              )
              .subscribe();
          } else {
            setTimeout(() => this.reconnectToSocket(), 1000);
          }
        });
    }
  }
}
