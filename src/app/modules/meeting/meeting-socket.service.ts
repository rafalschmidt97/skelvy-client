import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MeetingService } from './meeting.service';
import { HubConnection } from '@aspnet/signalr';
import { NavController } from '@ionic/angular';
import { ChatMessageDto } from './meeting';
import { Store } from '@ngxs/store';
import { ChatService } from '../chat/chat.service';
import { BackgroundService } from '../../core/background/background.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingSocketService {
  private userSocket: HubConnection;

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
    this.onUserSentMeetingChatMessage();
    this.onUserJoinedMeeting();
    this.onUserFoundMeeting();
    this.onUserLeftMeeting();
    this.onMeetingAborted();
    this.onMeetingRequestExpired();
    this.onMeetingExpired();
  }

  private onUserSentMeetingChatMessage() {
    this.userSocket.on(
      'UserSentMeetingChatMessage',
      async (message: ChatMessageDto) => {
        if (
          this.backgroundService.inBackground &&
          this.backgroundService.allowPush
        ) {
          if (message.message) {
            this.backgroundService.create(
              this.getProfileName(message.userId),
              message.message,
              { foreground: false, redirect_to: 'chat' },
              false,
              false,
            );
          } else if (message.attachmentUrl) {
            this.backgroundService.create(
              this.getProfileName(message.userId),
              _('USER_SENT_PHOTO'),
              { foreground: false, redirect_to: 'chat' },
              false,
              true,
            );
          } else {
            this.backgroundService.create(
              this.getProfileName(message.userId),
              _('USER_SENT_MESSAGE'),
              { foreground: false, redirect_to: 'chat' },
              false,
            );
          }
        }

        await this.chatService.addMessage(message);
      },
    );
  }

  private onUserJoinedMeeting() {
    this.userSocket.on('UserJoinedMeeting', data => {
      if (
        this.backgroundService.inBackground &&
        this.backgroundService.allowPush
      ) {
        this.backgroundService.create(_('MEETING'), _('USER_JOINED_MEETING'), {
          foreground: false,
          redirect_to: 'meeting',
        });
      }

      this.meetingService.addUser(data.userId).subscribe(
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
    });
  }

  private onUserFoundMeeting() {
    this.userSocket.on('UserFoundMeeting', () => {
      if (
        this.backgroundService.inBackground &&
        this.backgroundService.allowPush
      ) {
        this.backgroundService.create(_('MEETING'), _('USER_FOUND_MEETING'), {
          foreground: false,
          redirect_to: 'meeting',
        });
      }

      this.meetingService.findMeeting().subscribe(
        () => {
          this.toastService.createInformation(_('New meeting has been found'));
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while finding the meeting'),
          );
        },
      );
    });
  }

  private onUserLeftMeeting() {
    this.userSocket.on('UserLeftMeeting', data => {
      if (
        this.backgroundService.inBackground &&
        this.backgroundService.allowPush
      ) {
        this.backgroundService.create(_('MEETING'), _('USER_LEFT_MEETING'), {
          foreground: false,
          redirect_to: 'meeting',
        });
      }

      this.meetingService.removeUser(data.userId);
    });
  }

  private onMeetingAborted() {
    this.userSocket.on('MeetingAborted', () => {
      if (
        this.backgroundService.inBackground &&
        this.backgroundService.allowPush
      ) {
        this.backgroundService.create(_('MEETING'), _('MEETING_ABORTED'), {
          foreground: false,
          redirect_to: 'meeting',
        });
      }

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
    });
  }

  private onMeetingRequestExpired() {
    this.userSocket.on('MeetingRequestExpired', () => {
      if (
        this.backgroundService.inBackground &&
        this.backgroundService.allowPush
      ) {
        this.backgroundService.create(
          _('MEETING_REQUEST'),
          _('MEETING_REQUEST_EXPIRED'),
          {
            foreground: false,
            redirect_to: 'meeting',
          },
        );
      }

      this.toastService.createInformation(_('Meeting request has expired'));
      this.meetingService.clearMeeting();
    });
  }

  private onMeetingExpired() {
    this.userSocket.on('MeetingExpired', () => {
      if (
        this.backgroundService.inBackground &&
        this.backgroundService.allowPush
      ) {
        this.backgroundService.create(_('MEETING'), _('MEETING_EXPIRED'), {
          foreground: false,
          redirect_to: 'meeting',
        });
      }

      this.toastService.createInformation(_('The meeting has expired'));

      if (this.router.url === '/app/chat') {
        this.routerNavigation.navigateBack(['/app/tabs/meeting']);
      }

      this.meetingService.clearMeeting();
    });
  }

  private getProfileName(userId: number): string {
    return this.store
      .selectSnapshot(state => state.meeting.meetingModel.meeting.users)
      .find(x => x.id === userId).profile.name;
  }
}
