import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { ChatMessage } from '../../chat';
import { Meeting, MeetingUser } from '../../../meeting/meeting';
import { User } from '../../../profile/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @ViewChild('actions') actions: TemplateRef<any>;
  @Input() messages: ChatMessage[];
  @Input() meeting: Meeting;
  @Input() user: User;
  dateToShow: Date;

  findUser(userId: number): MeetingUser {
    return this.meeting.users.find(user => user.id === userId);
  }

  showDate(date: Date) {
    if (this.dateToShow === date) {
      this.dateToShow = null; // toggle if same date passed
    } else {
      this.dateToShow = date;
    }
  }
}
