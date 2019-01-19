import { Component, OnInit } from '@angular/core';
import { Message } from '../chat';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage implements OnInit {
  messages: Message[] = [];

  ngOnInit() {
    // TODO: get messages from server
  }

  sendMessage(message: Message) {
    // TODO: send message to server
    this.messages.push(message);
  }
}
