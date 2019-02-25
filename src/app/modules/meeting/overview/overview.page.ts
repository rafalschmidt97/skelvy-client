import { Component, OnInit } from '@angular/core';
import { MeetingModel, MeetingRequest } from '../meeting';
import { MeetingStoreService } from '../meeting-store.service';
import { Observable } from 'rxjs';
import { UserStoreService } from '../../profile/user-store.service';
import { User } from '../../profile/user';
import { MeetingService } from '../meeting.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage implements OnInit {
  meeting$: Observable<MeetingModel>;
  user$: Observable<User>;
  request: MeetingRequest;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly meetingService: MeetingService,
    private readonly userStore: UserStoreService,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
  }

  ngOnInit() {
    // TODO: use meetingService to get meeting
  }
}
