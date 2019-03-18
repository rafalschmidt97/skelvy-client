import { Injectable } from '@angular/core';
import { MeetingSocketService } from '../meeting/meeting-socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly meetingSocket: MeetingSocketService) {}

  sendMessage(message) {
    this.meetingSocket.sendMessage(message);
  }

  loadMessages(fromDate: Date, toDate: Date) {
    this.meetingSocket.loadMessages(fromDate, toDate);
  }
}
