import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Meeting } from '../meeting/meeting';
import { MeetingStoreService } from '../meeting/meeting-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  meeting$: Observable<Meeting>;

  constructor(
    private readonly store: MeetingStoreService,
    private readonly router: Router,
  ) {
    this.meeting$ = store.data;
  }

  get hiddenNavigation() {
    return this.router.url === '/tabs/chat';
  }
}
