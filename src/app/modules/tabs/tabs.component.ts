import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingModel } from '../meeting/meeting';
import { MeetingStoreService } from '../meeting/meeting-store.service';
import { ChatStoreService } from '../chat/chat-store.service';
import { Connection } from '../user/user';
import { UserStoreService } from '../user/user-store.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit {
  meeting$: Observable<MeetingModel>;
  messagesToRead = 0;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
    private readonly userStore: UserStoreService,
    private readonly storage: Storage,
  ) {
    this.meeting$ = meetingStore.data$;
  }

  ngOnInit() {
    this.userStore.data$.subscribe(async user => {
      if (user && user.connection === Connection.CONNECTED) {
        await this.storage.set('user', user);
      }
    });

    this.meetingStore.data$.subscribe(async meeting => {
      if (!meeting || !meeting.loading) {
        await this.storage.set('meeting', meeting);
      }
    });

    this.chatStore.data$.subscribe(async chat => {
      if (chat && chat.messages) {
        this.messagesToRead = chat.toRead;
      } else {
        this.messagesToRead = 0;
      }

      await this.storage.set('chat', chat);
    });
  }
}
