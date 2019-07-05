import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingStateModel } from '../meeting/meeting';
import { MeetingState } from '../meeting/meeting-state';
import { ChatState } from '../chat/chat-state';
import { UserState } from '../user/user-state';
import { Storage } from '@ionic/storage';
import { GlobalState } from '../../core/state/global-state';
import { storageKeys } from '../../core/storage/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit {
  meeting$: Observable<MeetingStateModel>;
  messagesToRead = 0;

  constructor(
    private readonly meetingState: MeetingState,
    private readonly chatState: ChatState,
    private readonly userState: UserState,
    private readonly globalState: GlobalState,
    private readonly storage: Storage,
  ) {
    this.meeting$ = meetingState.data$;
  }

  ngOnInit() {
    this.globalState.data$.subscribe(state => {
      if (state) {
        this.messagesToRead = state.toRead;
      }
    });

    this.userState.data$.subscribe(async user => {
      await this.storage.set(storageKeys.userState, user);
    });

    this.meetingState.data$.subscribe(async meeting => {
      const state = this.globalState.data;
      if (state && !state.loadingMeeting) {
        await this.storage.set(storageKeys.meetingState, meeting);
      }
    });

    this.chatState.data$.subscribe(async chat => {
      const state = this.globalState.data;
      if (state && !state.loadingMeeting) {
        await this.storage.set(storageKeys.meetingState, chat);
      }
    });
  }
}
