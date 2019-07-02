import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingModel } from '../meeting/meeting';
import { MeetingStoreService } from '../meeting/meeting-store.service';
import { ChatStoreService } from '../chat/chat-store.service';
import { UserStoreService } from '../user/user-store.service';
import { Storage } from '@ionic/storage';
import { StateStoreService } from '../../core/state/state-store.service';

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
    private readonly stateStore: StateStoreService,
    private readonly storage: Storage,
  ) {
    this.meeting$ = meetingStore.data$;
  }

  ngOnInit() {
    this.stateStore.data$.subscribe(state => {
      if (state) {
        this.messagesToRead = state.toRead;
      }
    });

    this.userStore.data$.subscribe(async user => {
      await this.storage.set('user', user);
    });

    this.meetingStore.data$.subscribe(async meeting => {
      const state = this.stateStore.data;
      if (state && !state.loadingMeeting) {
        await this.storage.set('meeting', meeting);
      }
    });

    this.chatStore.data$.subscribe(async chat => {
      const state = this.stateStore.data;
      if (state && !state.loadingMeeting) {
        await this.storage.set('chat', chat);
      }
    });
  }
}
