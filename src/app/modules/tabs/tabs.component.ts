import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MeetingModel } from '../meeting/meeting';
import { MeetingStoreService } from '../meeting/meeting-store.service';
import { ChatStoreService } from '../chat/chat-store.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit {
  meeting$: Observable<MeetingModel>;
  messagesDifference = 0;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly chatStore: ChatStoreService,
  ) {
    this.meeting$ = meetingStore.data$;
  }

  ngOnInit() {
    this.chatStore.data$.subscribe(chat => {
      if (chat && chat.messages) {
        this.messagesDifference = chat.messages.length - chat.messagesSeen;
      }
    });
  }
}
