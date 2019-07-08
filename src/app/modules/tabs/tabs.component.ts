import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserState } from '../user/store/user-state';
import { Storage } from '@ionic/storage';
import { GlobalState } from '../../core/state/global-state';
import { storageKeys } from '../../core/storage/storage';
import { SettingsState } from '../settings/store/settings-state';
import {
  MeetingState,
  MeetingStateModel,
} from '../meeting/store/meeting-state';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit {
  meeting$: Observable<MeetingStateModel>;
  messagesToRead = 0;

  constructor(
    private readonly meetingState: MeetingState,
    private readonly userState: UserState,
    private readonly globalState: GlobalState,
    private readonly settingsState: SettingsState,
    private readonly storage: Storage,
  ) {
    this.meeting$ = meetingState.data$;
  }

  ngOnInit() {
    this.userState.data$.subscribe(async user => {
      if (!user.loading) {
        await this.storage.set(storageKeys.userState, user);
      }
    });

    this.meetingState.data$.subscribe(async meeting => {
      this.messagesToRead = meeting.toRead;
      if (!meeting.loading) {
        await this.storage.set(storageKeys.meetingState, meeting);
      }
    });

    this.settingsState.data$.subscribe(async settings => {
      await this.storage.set(storageKeys.settingsState, settings);
    });
  }
}
