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
import { MeetingsSocketService } from '../meetings/meetings-socket.service';
import { AuthService } from '../../core/auth/auth.service';
import { NavController } from '@ionic/angular';
import { Connection } from '../../core/state/global-state';
import { tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ChangeConnectionStatus } from '../../core/state/global-actions';
import { SelfService } from './self.service';
import { SocketNotificationMessage } from '../../core/background/background';
import { BackgroundService } from '../../core/background/background.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserSocketService {
  private readonly socket: HubConnection;
  private initialized = false;
  private disconnected = true;
  private reconnectFailedAttempts = 0;
  private readonly usersNotifications = [
    _('USER'),
    _('USER_REMOVED'),
    _('USER_DISABLED'),
    _('FRIENDS'),
    _('NEW_FRIEND_INVITATION'),
    _('FRIEND_INVITATION_ACCEPTED'),
  ];

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly meetingSocket: MeetingsSocketService,
    private readonly selfService: SelfService,
    private readonly authService: AuthService,
    private readonly routerNavigation: NavController,
    private readonly store: Store,
    private readonly backgroundService: BackgroundService,
    private readonly userService: UserService,
    private readonly router: Router,
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
      this.onUserSentFriendInvitation();
      this.onUserRespondedFriendInvitation();
      this.onFriendRemoved();

      this.initialized = true;
    }

    this.connectToSocket();
  }

  disconnect() {
    if (this.socket.state === HubConnectionState.Connected) {
      this.disconnected = true;

      this.socket.stop().catch(() => {
        this.toastService.createError(
          _('A problem occurred while disconnecting from the server'),
        );
      });
    }
  }

  private onClose() {
    this.socket.onclose(() => {
      if (!this.disconnected) {
        this.reconnectToSocket();
      } else {
        this.store.dispatch(
          new ChangeConnectionStatus(Connection.DISCONNECTED),
        );
      }
    });
  }

  private onUserRemoved() {
    this.socket.on('UserRemoved', (notification: SocketNotificationMessage) => {
      this.authService.logoutWithoutRequest().then(() => {
        this.routerNavigation.navigateBack(['/home/sign-in']);
        this.toastService.createInformationFromNotification(notification);
      });
    });
  }

  private onUserDisabled() {
    this.socket.on(
      'UserDisabled',
      (notification: SocketNotificationMessage) => {
        this.authService.logoutWithoutRequest().then(() => {
          this.routerNavigation.navigateBack(['/home/sign-in']);
          this.toastService.createInformationFromNotification(notification);
        });
      },
    );
  }

  private connectToSocket() {
    this.store.dispatch(new ChangeConnectionStatus(Connection.CONNECTING));

    this.socket
      .start()
      .then(() => {
        this.store.dispatch(new ChangeConnectionStatus(Connection.CONNECTED));
        this.disconnected = false;
      })
      .catch(error => {
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
          this.store.dispatch(new ChangeConnectionStatus(Connection.CONNECTED));
          this.disconnected = false;
          this.selfService.sync().subscribe();
        })
        .catch(error => {
          this.reconnectFailedAttempts++;

          if (this.reconnectFailedAttempts === 1) {
            this.store.dispatch(
              new ChangeConnectionStatus(Connection.RECONNECTING),
            );
          } else if (this.reconnectFailedAttempts === 5) {
            this.store.dispatch(new ChangeConnectionStatus(Connection.WAITING));
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

  private onUserSentFriendInvitation() {
    this.socket.on(
      'UserSentFriendInvitation',
      (notification: SocketNotificationMessage) => {
        this.backgroundService.createFromNotification(notification);

        if (this.router.url !== `/app/settings/friends`) {
          this.toastService.createInformationFromNotification(
            notification,
            () => {
              this.routerNavigation.navigateForward([`/app/settings/friends`]);
            },
          );
        }

        this.userService.findFriendInvitations().subscribe();
      },
    );
  }

  private onUserRespondedFriendInvitation() {
    this.socket.on(
      'UserRespondedFriendInvitation',
      (notification: SocketNotificationMessage) => {
        const { isAccepted } = notification.data.data;

        if (isAccepted) {
          this.backgroundService.createFromNotification(notification);

          if (this.router.url !== `/app/settings/friends`) {
            this.toastService.createInformationFromNotification(
              notification,
              () => {
                this.routerNavigation.navigateForward([
                  `/app/settings/friends`,
                ]);
              },
            );
          }

          this.userService.findFriends().subscribe();
        }
      },
    );
  }

  private onFriendRemoved() {
    this.socket.on(
      'FriendRemoved',
      (notification: SocketNotificationMessage) => {
        const { removingUserId } = notification.data.data;
        this.userService.clearFriend(removingUserId);
      },
    );
  }
}
