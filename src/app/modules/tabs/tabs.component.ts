import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { storageKeys } from '../../core/storage/storage';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit {
  messagesToRead = 0;

  constructor(
    private readonly storage: Storage,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .subscribe(async user => {
        if (!user.loading) {
          await this.storage.set(storageKeys.userState, user);
        }
      });

    this.store
      .select(state => state.meeting)
      .subscribe(async meeting => {
        if (!meeting.loading) {
          this.messagesToRead = meeting.toRead;
          await this.storage.set(storageKeys.meetingState, meeting);
        }
      });

    this.store
      .select(state => state.settings)
      .subscribe(async settings => {
        await this.storage.set(storageKeys.settingsState, settings);
      });
  }
}
