import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../chat/chat';
import { _ } from '../../core/i18n/translate';
import { SessionService } from '../../core/auth/session.service';
import { ToastService } from '../../core/toast/toast.service';
import { Router } from '@angular/router';
import { ChatStoreService } from '../chat/chat-store.service';
import { Storage } from '@ionic/storage';
import { MeetingStoreService } from './meeting-store.service';
import { MeetingService } from './meeting.service';
import { HubConnection } from '@aspnet/signalr';
import { NavController } from '@ionic/angular';

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
    private readonly chatStore: ChatStoreService,
    private readonly meetingStore: MeetingStoreService,
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
        this.chatStore.addMessage(message);

        if (this.router.url !== '/app/chat') {
          this.chatStore.addToRead(1);
        } else {
          this.storage.set('lastMessageDate', message.date);
        }
      },
    );
  }

  private onUserJoinedMeeting() {
    this.userSocket.on('UserJoinedMeeting', data => {
      this.meetingService.findUser(data.userId).subscribe(
        user => {
          this.meetingStore.addUser(user);
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
      if (this.meetingStore.data.meeting.users.length !== 2) {
        this.meetingStore.removeUser(data.userId);
      } else {
        this.meetingService.findMeeting().subscribe(
          () => {
            this.toastService.createInformation(
              _('All users have left the group'),
            );

            if (this.router.url !== '/app/chat') {
              this.clearChat();
            } else {
              this.routerNavigation.navigateBack(['/app/tabs/meeting']);
              setTimeout(() => {
                this.clearChat();
              }, 1000);
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
      this.clearMeeting();
    });
  }

  private onMeetingExpired() {
    this.userSocket.on('MeetingExpired', () => {
      this.toastService.createInformation(_('The meeting has expired'));

      if (this.router.url !== '/app/chat') {
        this.clearMeeting();
        this.clearChat();
      } else {
        this.routerNavigation.navigateBack(['/app/tabs/meeting']);
        setTimeout(() => {
          this.clearMeeting();
          this.clearChat();
        }, 1000);
      }
    });
  }

  private clearMeeting() {
    this.meetingStore.set(null);
  }

  private clearChat() {
    this.chatStore.set(null);
    this.storage.remove('lastMessageDate');
  }
}
