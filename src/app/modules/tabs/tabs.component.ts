import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingModel } from '../meeting/meeting';
import { MeetingStoreService } from '../meeting/meeting-store.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  meeting$: Observable<MeetingModel>;

  constructor(private readonly meetingStore: MeetingStoreService) {
    this.meeting$ = meetingStore.data$;
  }
}
