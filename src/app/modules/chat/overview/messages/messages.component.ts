import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Modal } from '../../../../shared/modal/modal';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Message } from '../../chat';
import { Meeting, MeetingUser } from '../../../meeting/meeting';
import { User } from '../../../profile/profile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @ViewChild('actions') actions: TemplateRef<any>;
  @Input() messages: Message[];
  @Input() meeting: Meeting;
  @Input() user: User;
  modal: Modal;
  modalUser: MeetingUser;
  dateToShow: Date;

  constructor(
    private readonly modalService: ModalService,
    private readonly router: Router,
  ) {}

  getUser(userId: number): MeetingUser {
    return this.meeting.users.find(user => user.id === userId);
  }

  isMine(userId: number): boolean {
    return this.user.id === userId;
  }

  showDetails(user: MeetingUser) {
    // dont show yourself
    if (user.id !== this.user.id) {
      this.modalUser = user;
      this.modal = this.modalService.show(this.actions);
    }
  }

  confirm() {
    this.modal.hide();
  }

  moveToDetails(userId: number) {
    this.modal.hide();
    this.router.navigate(['/tabs/meeting', { userId: userId }]);
  }

  showDate(date: Date) {
    if (this.dateToShow === date) {
      this.dateToShow = null; // toggle if same date passed
    } else {
      this.dateToShow = date;
    }
  }
}
