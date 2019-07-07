import { ChatMessageState } from '../chat';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  AddChatMessage,
  MarkChatMessageAsFailed,
  MarkChatMessageAsSent,
  RemoveChatMessage,
  RemoveOldAndAddNewChatMessage,
  SetChat,
  SetChatMessages,
} from './chat-actions';
import { Observable } from 'rxjs';

export interface ChatStateModel {
  messages: ChatMessageState[];
}

@State<ChatStateModel>({
  name: 'chat',
  defaults: null,
})
export class ChatStateRedux {
  @Action(AddChatMessage)
  addMessage(
    { getState, setState }: StateContext<ChatStateModel>,
    { message }: AddChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      messages: [...state.messages, message],
    });
  }

  @Action(RemoveChatMessage)
  removeMessage(
    { getState, setState }: StateContext<ChatStateModel>,
    { message }: RemoveChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      messages: state.messages.filter(
        x => new Date(x.date).getTime() !== new Date(message.date).getTime(),
      ),
    });
  }

  @Action(SetChatMessages)
  setMessages(
    { getState, setState }: StateContext<ChatStateModel>,
    { messages }: SetChatMessages,
  ) {
    const state = getState();
    setState({
      ...state,
      messages,
    });
  }

  @Action(RemoveOldAndAddNewChatMessage)
  removeOldAndAddNew(
    { getState, setState }: StateContext<ChatStateModel>,
    { oldMessage, newMessage }: RemoveOldAndAddNewChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      messages: [
        ...state.messages.filter(
          x =>
            new Date(x.date).getTime() !== new Date(oldMessage.date).getTime(),
        ),
        newMessage,
      ],
    });
  }

  @Action(MarkChatMessageAsSent)
  markAsSent(
    { getState, setState }: StateContext<ChatStateModel>,
    { message }: MarkChatMessageAsSent,
  ) {
    const state = getState();
    setState({
      ...state,
      messages: state.messages.map(x => {
        if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
          x.sending = false;
          x.failed = false;
        }

        return x;
      }),
    });
  }

  @Action(MarkChatMessageAsFailed)
  markAsFailed(
    { getState, setState }: StateContext<ChatStateModel>,
    { message }: MarkChatMessageAsFailed,
  ) {
    const state = getState();
    setState({
      ...state,
      messages: state.messages.map(x => {
        if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
          x.sending = false;
          x.failed = true;
        }

        return x;
      }),
    });
  }

  @Action(SetChat)
  set({ setState }: StateContext<ChatStateModel>, { model }: SetChat) {
    setState(model);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ChatState {
  constructor(private readonly store: Store) {}

  addMessage(message: ChatMessageState) {
    this.store.dispatch(new AddChatMessage(message));
  }

  removeMessage(message: ChatMessageState) {
    this.store.dispatch(new RemoveChatMessage(message));
  }

  setMessages(messages: ChatMessageState[]) {
    this.store.dispatch(new SetChatMessages(messages));
  }

  removeOldAndAddNew(
    oldMessage: ChatMessageState,
    newMessage: ChatMessageState,
  ) {
    this.store.dispatch(
      new RemoveOldAndAddNewChatMessage(oldMessage, newMessage),
    );
  }

  markAsSent(message: ChatMessageState) {
    this.store.dispatch(new MarkChatMessageAsSent(message));
  }

  markAsFailed(message: ChatMessageState) {
    this.store.dispatch(new MarkChatMessageAsFailed(message));
  }

  set(model: ChatStateModel) {
    this.store.dispatch(new SetChat(model));
  }

  get data(): ChatStateModel {
    return this.store.selectSnapshot(state => state.chat);
  }

  get data$(): Observable<ChatStateModel> {
    return this.store.select(state => state.chat);
  }
}
