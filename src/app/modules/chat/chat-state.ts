import { Injectable } from '@angular/core';
import { State } from '../../shared/state';
import { ChatMessageState, ChatStateModel } from './chat';

@Injectable({
  providedIn: 'root',
})
export class ChatState extends State<ChatStateModel> {
  addMessage(message: ChatMessageState) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [...this.subject.getValue().messages, message],
    });
  }

  removeMessage(message: ChatMessageState) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject
          .getValue()
          .messages.filter(
            x =>
              new Date(x.date).getTime() !== new Date(message.date).getTime(),
          ),
      ],
    });
  }

  setMessages(messages: ChatMessageState[]) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: messages,
    });
  }

  removeOldAndAddNew(
    oldMessage: ChatMessageState,
    newMessage: ChatMessageState,
  ) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject
          .getValue()
          .messages.filter(
            x =>
              new Date(x.date).getTime() !==
              new Date(oldMessage.date).getTime(),
          ),
        newMessage,
      ],
    });
  }

  markAsSent(message: ChatMessageState) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject.getValue().messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            x.sending = false;
            x.failed = false;
          }

          return x;
        }),
      ],
    });
  }

  markAsFailed(message: ChatMessageState) {
    this.subject.next({
      ...this.subject.getValue(),
      messages: [
        ...this.subject.getValue().messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            x.sending = false;
            x.failed = true;
          }

          return x;
        }),
      ],
    });
  }
}
