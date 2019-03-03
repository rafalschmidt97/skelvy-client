import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { MeetingHubService } from '../meeting/meeting-hub.service';
import { ToastService } from '../../core/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly meetingHub: MeetingHubService,
    private readonly toastService: ToastService,
  ) {}

  sendMessage(message: string) {
    this.meetingHub.hub.invoke('SendMessage', message).catch(() => {
      this.toastService.createError(_('Error while sending message'));
    });
  }
}
