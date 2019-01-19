import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Modal } from '../../../../shared/modal/modal';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Message } from '../../chat';
import { MeetingUser } from '../../../meeting/meeting';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @ViewChild('actions') actions: TemplateRef<any>;
  @Input() messages: Message[];
  modal: Modal;
  modalUser: MeetingUser;

  constructor(private readonly modalService: ModalService) {}

  open(userId: number) {
    // this.modalUser = store.meeting.users.find(user => user.id = userId);
    this.modal = this.modalService.show(this.actions);
  }

  confirm() {
    this.modal.hide();
  }
}
