import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MeetingsService } from './meetings.service';
import { HubConnection } from '@aspnet/signalr';
import { NavController } from '@ionic/angular';
import {
  GroupUserRole,
  MessageActionType,
  MessageDto,
  MessageType,
} from './meetings';
import { Store } from '@ngxs/store';
import { BackgroundService } from '../../core/background/background.service';
import {
  SocketNotificationMessage,
  SocketNotificationType,
} from '../../core/background/background';
import { GroupsService } from '../groups/groups.service';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetingsSocketService {
  private userSocket: HubConnection;
  private readonly meetingsNotifications = [
    _('USER_SENT_PHOTO'),
    _('USER_SENT_MESSAGE'),
    _('MEETINGS'),
    _('GROUPS'),
    _('USER_JOINED_MEETING'),
    _('USER_CONNECTED_TO_MEETING'),
    _('USER_LEFT_MEETING'),
    _('USER_REMOVED_FROM_MEETING'),
    _('USER_SELF_REMOVED_FROM_MEETING'),
    _('USER_LEFT_GROUP'),
    _('MEETING_ABORTED'),
    _('MEETING_UPDATED'),
    _('MEETING_USER_ROLE_UPDATED'),
    _('GROUP_ABORTED'),
    _('MEETING_REQUEST_EXPIRED'),
    _('MEETING_REQUEST'),
    _('MEETING_EXPIRED'),
  ];

  constructor(
    private readonly sessionService: SessionService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly routerNavigation: NavController,
    private readonly meetingService: MeetingsService,
    private readonly storage: Storage,
    private readonly store: Store,
    private readonly groupsService: GroupsService,
    private readonly backgroundService: BackgroundService,
  ) {}

  set socket(socket: HubConnection) {
    this.userSocket = socket;
  }

  onMeetingActions() {
    this.onUserSentMessage();
    this.onUserJoinedMeeting();
    this.onUserConnectedToMeeting();
    this.onUserLeftMeeting();
    this.onUserRemovedFromMeeting();
    this.onUserSelfRemovedFromMeeting();
    this.onUserLeftGroup();
    this.onMeetingAborted();
    this.onMeetingUpdated();
    this.onMeetingUserRoleUpdated();
    this.onMeetingRequestExpired();
    this.onGroupAborted();
    this.onMeetingExpired();
    this.onUserSentMeetingInvitation();
    this.onUserRespondedMeetingInvitation();
  }

  private onUserSentMessage() {
    this.userSocket.on(
      'UserSentMessage',
      async (
        notification: SocketNotificationMessage<{
          groupId: number;
          messages: MessageDto[];
        }>,
      ) => {
        this.showNotificationIfBackground(notification);

        const data = notification.data.data;
        const persistenceMessages = data.messages.filter(x => {
          return (
            x.type === MessageType.RESPONSE ||
            (x.type === MessageType.ACTION &&
              x.action === MessageActionType.SEEN)
          );
        });

        if (persistenceMessages.length > 0) {
          await this.groupsService.addSentMessagesWithReading(
            data.groupId,
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

        const { userId, groupId, role } = notification.data.data;
        this.meetingService.addUser(userId, groupId, role).subscribe(
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

  private onUserConnectedToMeeting() {
    this.userSocket.on(
      'UserConnectedToMeeting',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { meetingId, requestId, groupId } = notification.data.data;
        this.meetingService.clearMeetingRequest(requestId);

        combineLatest([
          this.meetingService.addFoundMeeting(meetingId),
          this.groupsService.addFoundGroup(groupId, true),
        ]).subscribe(
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

        const { userId, groupId } = notification.data.data;
        this.meetingService.removeUser(userId, groupId);
      },
    );
  }

  private onUserLeftGroup() {
    this.userSocket.on(
      'UserLeftGroup',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { userId, groupId } = notification.data.data;
        this.meetingService.removeUser(userId, groupId);
      },
    );
  }

  private onUserRemovedFromMeeting() {
    this.userSocket.on(
      'UserRemovedFromMeeting',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { removedUserId, groupId } = notification.data.data;
        this.meetingService.removeUser(removedUserId, groupId);
      },
    );
  }

  private onMeetingAborted() {
    this.userSocket.on(
      'MeetingAborted',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { groupId } = notification.data.data;

        combineLatest([
          this.meetingService.findMeetings(),
          this.meetingService.findRequests(true),
        ]).subscribe(
          () => {
            this.toastService.createInformation(
              _('The meeting has been aborted'),
            );

            if (this.router.url === `/app/groups/${groupId}/chat`) {
              this.routerNavigation.navigateBack(['/app/tabs/meetings']);
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

  private onMeetingUpdated() {
    this.userSocket.on(
      'MeetingUpdated',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { meetingId } = notification.data.data;
        this.meetingService.syncMeeting(meetingId).subscribe(
          () => {
            this.toastService.createInformation(_('Meeting has been updated'));
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

  private onMeetingUserRoleUpdated() {
    this.userSocket.on(
      'MeetingUserRoleUpdated',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);
        const { groupId, updatedUserId, role } = notification.data.data;
        this.meetingService.updatedUserRole(groupId, updatedUserId, role);
      },
    );
  }

  private onMeetingRequestExpired() {
    this.userSocket.on(
      'MeetingRequestExpired',
      (notification: SocketNotificationMessage) => {
        const { requestId } = notification.data.data;

        this.showNotificationIfBackground(notification);

        this.toastService.createInformation(_('Meeting request has expired'));
        this.meetingService.clearMeetingRequest(requestId);
      },
    );
  }

  private onGroupAborted() {
    this.userSocket.on(
      'GroupAborted',
      (notification: SocketNotificationMessage) => {
        const { groupId } = notification.data.data;

        this.showNotificationIfBackground(notification);

        this.toastService.createInformation(_('The group has been aborted'));

        if (this.router.url === `/app/groups/${groupId}/chat`) {
          this.routerNavigation.navigateBack(['/app/tabs/groups']);
        }

        this.groupsService.clearGroup(groupId);
      },
    );
  }

  private onMeetingExpired() {
    this.userSocket.on(
      'MeetingExpired',
      (notification: SocketNotificationMessage) => {
        const { meetingId, groupId } = notification.data.data;

        this.showNotificationIfBackground(notification);

        this.toastService.createInformation(_('The meeting has expired'));

        if (this.router.url === `/app/groups/${groupId}/chat`) {
          this.routerNavigation.navigateBack(['/app/tabs/meetings']);
        }

        this.meetingService.clearMeeting(meetingId, groupId);
      },
    );
  }

  private onUserSelfRemovedFromMeeting() {
    this.userSocket.on(
      'UserSelfRemovedFromMeeting',
      (notification: SocketNotificationMessage) => {
        const { meetingId, groupId } = notification.data.data;

        this.showNotificationIfBackground(notification);

        this.toastService.createInformation(
          _('You have been removed from the meeting'),
        );

        if (this.router.url === `/app/groups/${groupId}/chat`) {
          this.routerNavigation.navigateBack(['/app/tabs/meetings']);
        }

        this.meetingService.clearMeeting(meetingId, groupId);
      },
    );
  }

  private onUserSentMeetingInvitation() {
    this.socket.on(
      'UserSentMeetingInvitation',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);
        this.meetingService.findMeetingInvitations().subscribe();
      },
    );
  }

  private onUserRespondedMeetingInvitation() {
    this.socket.on(
      'UserRespondedMeetingInvitation',
      (notification: SocketNotificationMessage) => {
        this.showNotificationIfBackground(notification);

        const { isAccepted, invitedUserId, groupId } = notification.data.data;

        if (isAccepted) {
          this.meetingService
            .addUser(invitedUserId, groupId, GroupUserRole.MEMBER)
            .subscribe(
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
        }
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
