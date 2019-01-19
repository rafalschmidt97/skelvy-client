import { Component } from '@angular/core';
import { Meeting, MeetingRequest } from '../meeting';
import { MeetingStoreService } from '../meeting-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage {
  meeting$: Observable<Meeting>;
  request: MeetingRequest;

  constructor(private readonly store: MeetingStoreService) {
    this.meeting$ = store.data;
  }

  leaveMeeting() {
    this.store.set(null);
  }

  removeRequest() {
    this.request = null;
  }

  addMeeting() {
    this.store.fill();
  }

  addRequest() {
    this.store.set(null);
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
