import { Component, EventEmitter, Output } from '@angular/core';
import { Message } from '../../chat';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent {
  @Output() sendMessage = new EventEmitter<Message>();
}
