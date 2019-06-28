import { Component } from '@angular/core';
import { ChatModel } from '../chat';
import { MeetingStoreService } from '../../meeting/meeting-store.service';
import { Observable } from 'rxjs';
import { MeetingModel } from '../../meeting/meeting';
import { UserStoreService } from '../../user/user-store.service';
import { UserDto } from '../../user/user';
import { ChatStoreService } from '../chat-store.service';
import { MeetingService } from '../../meeting/meeting.service';
import { _ } from '../../../core/i18n/translate';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage {
  chat$: Observable<ChatModel>;
  meeting$: Observable<MeetingModel>;
  user$: Observable<UserDto>;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly userStore: UserStoreService,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly chatStore: ChatStoreService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly storage: Storage,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
    this.chat$ = chatStore.data$;
  }

  sendMessage(message) {
    this.chatStore.addMessage(message);
    this.storage.set('lastMessageDate', message.date);

    this.chatService.sendMessage(message).subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404 || error.status === 409) {
          this.meetingService.findMeeting().subscribe();

          if (this.router.url === '/app/chat') {
            this.routerNavigation.navigateBack(['/app/tabs/meeting']);
          }
        } else {
          this.chatStore.removeMessage(message);
        }

        this.toastService.createError(
          _('A problem occurred while sending the message'),
        );
      },
    );
  }
}
