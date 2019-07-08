import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MeetingState } from './store/meeting-state';
import { MeetingService } from './meeting.service';
import { HubConnection } from '@aspnet/signalr';
import { NavController } from '@ionic/angular';
import { storageKeys } from '../../core/storage/storage';
import { ChatMessageDto } from './meeting';

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
    private readonly meetingState: MeetingState,
    private readonly meetingService: MeetingService,
    private readonly storage: Storage,
  ) {}

  set socket(socket: HubConnection) {
    this.userSocket = socket;
  }

  onMeetingActions() {
    this.onUserSentMeetingChatMessage();
    this.onUserJoinedMeeting();
    this.onUserFoundMeeting();
    this.onUserLeftMeeting();
    this.onMeetingRequestExpired();
    this.onMeetingExpired();
  }

  private onUserSentMeetingChatMessage() {
    this.userSocket.on(
      'UserSentMeetingChatMessage',
      (message: ChatMessageDto) => {
        this.meetingState.addMessage(message);

        if (this.router.url !== '/app/chat') {
          this.meetingState.addToRead(1);
        } else {
          this.storage.set(storageKeys.lastMessageDate, message.date);
        }
      },
    );
  }

  private onUserJoinedMeeting() {
    this.userSocket.on('UserJoinedMeeting', data => {
      this.meetingService.findUser(data.userId).subscribe(
        user => {
          this.meetingState.addUser(user);
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
      if (this.meetingState.data.meeting.meeting.users.length !== 2) {
        this.meetingState.removeUser(data.userId);
      } else {
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
      }
    });
  }

  private onMeetingRequestExpired() {
    this.userSocket.on('MeetingRequestExpired', () => {
      this.toastService.createInformation(_('Meeting request has expired'));
      this.meetingService.clearMeeting();
    });
  }

  private onMeetingExpired() {
    this.userSocket.on('MeetingExpired', () => {
      this.toastService.createInformation(_('The meeting has expired'));

      if (this.router.url === '/app/chat') {
        this.routerNavigation.navigateBack(['/app/tabs/meeting']);
      }

      this.meetingService.clearMeeting();
    });
  }
}
