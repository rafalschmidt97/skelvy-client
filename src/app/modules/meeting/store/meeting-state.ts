import {
  ChatMessageState,
  MeetingDto,
  MeetingRequestDto,
  MeetingStatus,
} from '../meeting';
import { Action, State, StateContext } from '@ngxs/store';
import {
  AddChatMessage,
  AddChatMessages,
  AddChatMessagesToRead,
  AddMeetingUser,
  ChangeMeetingLoadingStatus,
  MarkChatMessageAsFailed,
  MarkChatMessageAsSent,
  RemoveChatMessage,
  RemoveMeetingUser,
  RemoveOldAndAddNewChatMessage,
  UpdateChatMessages,
  UpdateChatMessagesToRead,
  UpdateMeeting,
} from './meeting-actions';

export interface MeetingStateModel {
  loading: boolean;
  toRead: number;
  meeting: MeetingModelState;
}

export interface MeetingModelState {
  status: MeetingStatus;
  meeting: MeetingDto;
  messages: ChatMessageState[];
  request: MeetingRequestDto;
}

@State<MeetingStateModel>({
  name: 'meeting',
  defaults: {
    loading: false,
    toRead: 0,
    meeting: null,
  },
})
export class MeetingState {
  @Action(ChangeMeetingLoadingStatus)
  changeMeetingLoadingStatus(
    { getState, setState }: StateContext<MeetingStateModel>,
    { status }: ChangeMeetingLoadingStatus,
  ) {
    const state = getState();
    setState({
      ...state,
      loading: status,
    });
  }

  @Action(AddMeetingUser)
  addUser(
    { getState, setState }: StateContext<MeetingStateModel>,
    { user }: AddMeetingUser,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        meeting: {
          ...state.meeting.meeting,
          user: [...state.meeting.meeting.users, user],
        },
      },
    });
  }

  @Action(RemoveMeetingUser)
  removeUser(
    { getState, setState }: StateContext<MeetingStateModel>,
    { userId }: RemoveMeetingUser,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        meeting: {
          ...state.meeting.meeting,
          user: state.meeting.meeting.users.filter(x => x.id !== userId),
        },
      },
    });
  }

  @Action(UpdateMeeting)
  updateMeeting(
    { getState, setState }: StateContext<MeetingStateModel>,
    { model }: UpdateMeeting,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: model,
    });
  }

  @Action(AddChatMessagesToRead)
  addChatMessagesToRead(
    { getState, setState }: StateContext<MeetingStateModel>,
    { amount }: AddChatMessagesToRead,
  ) {
    const state = getState();
    setState({
      ...state,
      toRead: state.toRead + amount,
    });
  }

  @Action(UpdateChatMessagesToRead)
  setChatMessagesToRead(
    { getState, setState }: StateContext<MeetingStateModel>,
    { amount }: UpdateChatMessagesToRead,
  ) {
    const state = getState();
    setState({
      ...state,
      toRead: amount,
    });
  }

  @Action(AddChatMessage)
  addMessage(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: AddChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: [...state.meeting.messages, message],
      },
    });
  }

  @Action(AddChatMessages)
  addMessages(
    { getState, setState }: StateContext<MeetingStateModel>,
    { messages, end }: AddChatMessages,
  ) {
    const state = getState();

    if (end) {
      setState({
        ...state,
        meeting: {
          ...state.meeting,
          messages: [...state.meeting.messages, ...messages],
        },
      });
    } else {
      setState({
        ...state,
        meeting: {
          ...state.meeting,
          messages: [...messages, ...state.meeting.messages],
        },
      });
    }
  }

  @Action(RemoveChatMessage)
  removeMessage(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: RemoveChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: state.meeting.messages.filter(
          x => new Date(x.date).getTime() !== new Date(message.date).getTime(),
        ),
      },
    });
  }

  @Action(UpdateChatMessages)
  updateMessages(
    { getState, setState }: StateContext<MeetingStateModel>,
    { messages }: UpdateChatMessages,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages,
      },
    });
  }

  @Action(RemoveOldAndAddNewChatMessage)
  removeOldAndAddNew(
    { getState, setState }: StateContext<MeetingStateModel>,
    { oldMessage, newMessage }: RemoveOldAndAddNewChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: [
          ...state.meeting.messages.filter(
            x =>
              new Date(x.date).getTime() !==
              new Date(oldMessage.date).getTime(),
          ),
          newMessage,
        ],
      },
    });
  }

  @Action(MarkChatMessageAsSent)
  markAsSent(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: MarkChatMessageAsSent,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: state.meeting.messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            return {
              ...x,
              sending: false,
              failed: false,
            };
          }

          return x;
        }),
      },
    });
  }

  @Action(MarkChatMessageAsFailed)
  markAsFailed(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: MarkChatMessageAsFailed,
  ) {
    const state = getState();
    setState({
      ...state,
      meeting: {
        ...state.meeting,
        messages: state.meeting.messages.map(x => {
          if (new Date(x.date).getTime() === new Date(message.date).getTime()) {
            return {
              ...x,
              sending: false,
              failed: true,
            };
          }

          return x;
        }),
      },
    });
  }
}
