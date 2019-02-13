import { Component } from '@angular/core';
import { Meeting, MeetingRequest } from '../meeting';
import { MeetingStoreService } from '../meeting-store.service';
import { Observable } from 'rxjs';
import { UserStoreService } from '../../profile/user-store.service';
import { User } from '../../profile/user';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage {
  meeting$: Observable<Meeting>;
  user$: Observable<User>;
  request: MeetingRequest;

  constructor(
    private readonly meeting: MeetingStoreService,
    private readonly userStore: UserStoreService,
  ) {
    this.meeting$ = meeting.data;
    this.user$ = userStore.data;
  }

  leaveMeeting() {
    this.meeting.set(null);
  }

  removeRequest() {
    this.request = null;
  }

  addMeeting() {
    this.meeting.fill();
  }

  addRequest() {
    this.meeting.set(null);
    this.fillRequest();
  }

  private fillRequest() {
    this.request = {
      id: 1,
      minimumDate: new Date(),
      maximumDate: new Date(),
      address: {
        latitude: 1,
        longitude: 1,
        city: 'Jastrzębie-Zdrój',
        state: 'Silesian',
        country: 'Poland',
      },
      drinks: [
        {
          id: 1,
          name: 'Beer',
        },
        {
          id: 2,
          name: 'Wine',
        },
        {
          id: 3,
          name: 'Whiskey',
        },
      ],
      minimumAge: 18,
      maximumAge: 25,
    };
  }
}
