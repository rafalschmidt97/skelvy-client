import {
  MeetingDto,
  MeetingRequestDto,
  MeetingStatus,
  MessageActionType,
  MessageDto,
  MessageState,
  MessageType,
} from '../meeting';
import { Action, State, StateContext } from '@ngxs/store';
import {
  AddChatMessage,
  AddChatMessages,
  AddChatMessagesToRead,
  AddMeetingUser,
  ChangeMeetingLoadingStatus,
  MarkResponseChatMessageAsFailed,
  MarkResponseChatMessageAsSent,
  RemoveMeetingUser,
  RemoveOldAndAddNewResponseChatMessage,
  RemoveResponseChatMessage,
  UpdateChatMessagesToRead,
  UpdateMeeting,
} from './meeting-actions';

export interface MeetingStateModel {
  loading: boolean;
  toRead: number;
  meetingModel: MeetingModelState;
}

export interface MeetingModelState {
  status: MeetingStatus;
  meeting: MeetingDto;
  messages: MessageState[];
  request: MeetingRequestDto;
}

@State<MeetingStateModel>({
  name: 'meeting',
  defaults: {
    loading: false,
    toRead: 0,
    meetingModel: null,
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
      meetingModel: {
        ...state.meetingModel,
        meeting: {
          ...state.meetingModel.meeting,
          users: [...state.meetingModel.meeting.users, user],
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
      meetingModel: {
        ...state.meetingModel,
        meeting: {
          ...state.meetingModel.meeting,
          users: state.meetingModel.meeting.users.filter(x => x.id !== userId),
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
      meetingModel: model,
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
      meetingModel: {
        ...state.meetingModel,
        messages: isSeenMessage(message)
          ? [
              ...state.meetingModel.messages.filter(
                x => !isSameSeenMessage(x, message),
              ),
              message,
            ]
          : [...state.meetingModel.messages, message],
      },
    });
  }

  @Action(AddChatMessages)
  addMessages(
    { getState, setState }: StateContext<MeetingStateModel>,
    { messages, end }: AddChatMessages,
  ) {
    const seenMessages = messages.filter(x => isSeenMessage(x));
    const state = getState();

    setState({
      ...state,
      meetingModel: {
        ...state.meetingModel,
        messages: end
          ? [
              ...state.meetingModel.messages.filter(
                x => !isSameSeenInMessages(x, seenMessages),
              ),
              ...messages,
            ]
          : [...messages, ...state.meetingModel.messages],
      },
    });
  }

  @Action(RemoveResponseChatMessage)
  removeMessage(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: RemoveResponseChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meetingModel: {
        ...state.meetingModel,
        messages: state.meetingModel.messages.filter(
          x => !isSameMessageByDate(x, message),
        ),
      },
    });
  }

  @Action(RemoveOldAndAddNewResponseChatMessage)
  removeOldAndAddNew(
    { getState, setState }: StateContext<MeetingStateModel>,
    { oldMessage, newMessage }: RemoveOldAndAddNewResponseChatMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      meetingModel: {
        ...state.meetingModel,
        messages: [
          ...state.meetingModel.messages.filter(
            x => !isSameMessageByDate(x, oldMessage),
          ),
          newMessage,
        ],
      },
    });
  }

  @Action(MarkResponseChatMessageAsSent)
  markAsSent(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message, apiMessages }: MarkResponseChatMessageAsSent,
  ) {
    const state = getState();
    const apiMessage = apiMessages.find(x => isSameMessageByFields(x, message));
    const otherMessages = apiMessages.filter(
      x => !isSameMessageByDate(x, apiMessage),
    );

    setState({
      ...state,
      meetingModel: {
        ...state.meetingModel,
        messages: [
          ...state.meetingModel.messages
            .map(x => {
              if (isSameMessageByDate(x, message)) {
                return {
                  ...x,
                  id: apiMessage.id,
                  date: apiMessage.date,
                  attachmentUrl: message.attachmentUrl,
                  sending: false,
                  failed: false,
                };
              }

              return x;
            })
            .filter(x => !isSameSeenMessage(x, apiMessage)),
          ...otherMessages,
        ],
      },
    });
  }

  @Action(MarkResponseChatMessageAsFailed)
  markAsFailed(
    { getState, setState }: StateContext<MeetingStateModel>,
    { message }: MarkResponseChatMessageAsFailed,
  ) {
    const state = getState();
    setState({
      ...state,
      meetingModel: {
        ...state.meetingModel,
        messages: state.meetingModel.messages.map(x => {
          if (isSameMessageByDate(x, message)) {
            return {
              ...x,
              attachmentUrl: message.attachmentUrl,
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

export function isSameMessageByDate(
  x: MessageState,
  message: MessageState | MessageDto,
): boolean {
  return new Date(x.date).getTime() === new Date(message.date).getTime();
}

export function isSameMessageByFields(
  x: MessageState,
  message: MessageState | MessageDto,
): boolean {
  return (
    x.type === message.type &&
    x.text === message.text &&
    x.action === message.action &&
    x.attachmentUrl === message.attachmentUrl &&
    x.userId === message.userId &&
    x.groupId === message.groupId
  );
}

export function isSameSeenMessage(
  x: MessageState,
  message: MessageState | MessageDto,
): boolean {
  return (
    isSeenMessage(x) &&
    x.userId === message.userId &&
    x.groupId === message.groupId
  );
}

export function isSeenMessage(x: MessageState): boolean {
  return x.type === MessageType.ACTION && x.action === MessageActionType.SEEN;
}

export function isSameSeenInMessages(
  x: MessageState,
  messages: MessageState[],
): boolean {
  return (
    messages.filter(y => isSeenMessage(x) && isSameSeenMessage(x, y)).length !==
    0
  );
}
