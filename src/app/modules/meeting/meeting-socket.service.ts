import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MeetingService } from './meeting.service';
import { HubConnection } from '@aspnet/signalr';
import { NavController } from '@ionic/angular';
import { MessageActionType, MessageDto, MessageType } from './meeting';
import { Store } from '@ngxs/store';
import { ChatService } from '../chat/chat.service';
import { BackgroundService } from '../../core/background/background.service';
import {
  SocketNotificationMessage,
  SocketNotificationType,
} from '../../core/background/background';

@Injectable({
  providedIn: 'root',
})
export class MeetingSocketService {
  private userSocket: HubConnection;
  private readonly meetingNotifications = [
    _('USER_SENT_PHOTO'),
    _('USER_SENT_MESSAGE'),
    _('MEETING'),
    _('USER_JOINED_MEETING'),
    _('USER_FOUND_MEETING'),
    _('USER_LEFT_MEETING'),
    _('MEETING_ABORTED'),
    _('MEETING_REQUEST_EXPIRED'),
    _('MEETING_REQUEST'),
    _('MEETING_EXPIRED'),
  ];

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly routerNavigation: NavController,
    private readonly meetingService: MeetingService,
    private readonly storage: Storage,
    private readonly store: Store,
    private readonly chatService: ChatService,
    private readonly backgroundService: BackgroundService,
  ) {}

  set socket(socket: HubConnection) {
    this.userSocket = socket;
  }

  onMeetingActions() {
    this.onUserSentMessage();
    this.onUserJoinedMeeting();
    this.onUserFoundMeeting();
    this.onUserLeftMeeting();
    this.onMeetingAborted();
    this.onMeetingRequestExpired();
    this.onMeetingExpired();
  }

  private onUserSentMessage() {
    this.userSocket.on(
      'UserSentMessage',
      async (notification: SocketNotificationMessage<MessageDto[]>) => {
        this.showNotificationIfBackground(notification);

        const messages = notification.data.data;
        const persistenceMessages = messages.filter(x => {
          return (
            x.type === MessageType.RESPONSE ||
            (x.type === MessageType.ACTION &&
              x.action === MessageActionType.SEEN)
          );
        });

        if (persistenceMessages.length > 0) {
          await this.chatService.addSentMessagesWithReading(
            persistenceMessages,
            this.store.selectSnapshot(state => state.user.user.id),
          );
        }
      },
    );
  }

  private onUserJoinedMeeting() {
    this.userSocket.on(
      'UserJoinedMeeting',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { userId } = notification.data.data;
        this.meetingService.addUser(userId).subscribe(
          () => {
            this.toastService.createInformation(
              _('New user has been added to the group'),
            );
          },
          () => {
            this.toastService.createError(
              _('A problem occurred loading meeting user'),
            );
          },
        );
      },
    );
  }

  private onUserFoundMeeting() {
    this.userSocket.on(
      'UserFoundMeeting',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        this.meetingService.findMeeting().subscribe(
          () => {
            this.toastService.createInformation(
              _('New meeting has been found'),
            );
          },
          () => {
            this.toastService.createError(
              _('A problem occurred while finding the meeting'),
            );
          },
        );
      },
    );
  }

  private onUserLeftMeeting() {
    this.userSocket.on(
      'UserLeftMeeting',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { userId } = notification.data.data;
        this.meetingService.removeUser(userId);
      },
    );
  }

  private onMeetingAborted() {
    this.userSocket.on(
      'MeetingAborted',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        this.meetingService.findMeeting().subscribe(
          () => {
            this.toastService.createInformation(
              _('All users have left the group'),
            );

            if (this.router.url === '/app/chat') {
              this.routerNavigation.navigateBack(['/app/tabs/meeting']);
            }
          },
          () => {
            this.toastService.createError(
              _('A problem occurred while finding the meeting'),
            );
          },
        );
      },
    );
  }

  private onMeetingRequestExpired() {
    this.userSocket.on(
      'MeetingRequestExpired',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        this.toastService.createInformation(_('Meeting request has expired'));
        this.meetingService.clearMeeting();
      },
    );
  }

  private onMeetingExpired() {
    this.userSocket.on(
      'MeetingExpired',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        this.toastService.createInformation(_('The meeting has expired'));

        if (this.router.url === '/app/chat') {
          this.routerNavigation.navigateBack(['/app/tabs/meeting']);
        }

        this.meetingService.clearMeeting();
      },
    );
  }

  private showNotificationIfBackground(
    notification: SocketNotificationMessage,
  ) {
    if (
      this.backgroundService.inBackground &&
      this.backgroundService.allowPush &&
      notification.type === SocketNotificationType.REGULAR
    ) {
      this.backgroundService.createFromNotification(notification);
    }
  }
}
