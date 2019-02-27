import { Component, OnInit } from '@angular/core';
import { Message } from '../chat';
import { MeetingStoreService } from '../../meeting/meeting-store.service';
import { Observable } from 'rxjs';
import { MeetingModel } from '../../meeting/meeting';
import { UserStoreService } from '../../profile/user-store.service';
import { User } from '../../profile/user';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage implements OnInit {
  messages: Message[] = [];
  meeting$: Observable<MeetingModel>;
  user$: Observable<User>;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly userStore: UserStoreService,
    private readonly routerNavigation: NavController,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
  }

  ngOnInit() {
    // TODO: get messages from server
  }

  sendMessage(message: Message) {
    // TODO: send message to server

    if (!(this.messages.length > 0)) {
      this.messages = [
        {
          date: new Date(),
          text: 'Hi everybody! Whats up?',
          userId: 2,
        },
        {
          date: new Date(),
          text: 'Yo!',
          userId: 3,
        },
        {
          date: new Date(),
          text: 'This app is so cool!',
          userId: 3,
        },
        {
          date: new Date(),
          text: 'When are you available guys?',
          userId: 4,
        },
      ];
    }

    this.messages.push(message);
  }

  clearMessages() {
    this.messages = [];
  }

  navigateBack() {
    if (window.history.length > 1) {
      this.routerNavigation.back({
        animated: false,
      });
    } else {
      this.routerNavigation.navigateBack(['/app/tabs/meeting'], {
        animated: false,
      });
    }
  }
}
