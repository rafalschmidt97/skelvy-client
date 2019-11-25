import {
  GroupState,
  MeetingDto,
  MeetingRequestDto,
  MessageActionType,
  MessageDto,
  MessageState,
  MessageType,
} from '../meetings';
import { Action, State, StateContext } from '@ngxs/store';
import {
  AddGroupMessage,
  AddGroupMessages,
  AddGroupUser,
  ChangeMeetingLoadingStatus,
  MarkResponseGroupMessageAsFailed,
  MarkResponseGroupMessageAsSent,
  RemoveGroup,
  RemoveGroupUser,
  RemoveMeeting,
  RemoveOldAndAddNewResponseGroupMessage,
  RemoveRequest,
  RemoveResponseGroupMessage,
  UpdateMeetingsFromModel,
  UpdateMeetingsState,
  UpdateRequests,
} from './meetings-actions';

export interface MeetingsStateModel {
  loading: boolean;
  meetings: MeetingDto[];
  requests: MeetingRequestDto[];
  groups: GroupState[];
}

@State<MeetingsStateModel>({
  name: 'meetings',
  defaults: {
    loading: false,
    meetings: [],
    requests: [],
    groups: [],
  },
})
export class MeetingsState {
  @Action(ChangeMeetingLoadingStatus)
  changeMeetingLoadingStatus(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { status }: ChangeMeetingLoadingStatus,
  ) {
    const state = getState();
    setState({
      ...state,
      loading: status,
    });
  }

  @Action(AddGroupUser)
  addUser(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, user }: AddGroupUser,
  ) {
    const state = getState();
    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.users = [...group.users, user];
        }

        return group;
      }),
    });
  }

  @Action(RemoveGroupUser)
  removeUser(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, userId }: RemoveGroupUser,
  ) {
    const state = getState();
    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.users = group.users.filter(x => x.id !== userId);
        }

        return group;
      }),
    });
  }

  @Action(UpdateMeetingsState)
  updateMeeting(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { meetings, requests, groups }: UpdateMeetingsState,
  ) {
    const state = getState();
    setState({ ...state, meetings, requests, groups });
  }

  @Action(UpdateMeetingsFromModel)
  updateMeetingsFromModel(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { meetings, groups }: UpdateMeetingsFromModel,
  ) {
    const state = getState();
    setState({ ...state, meetings, groups });
  }

  @Action(UpdateRequests)
  updateRequests(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { requests }: UpdateRequests,
  ) {
    const state = getState();
    setState({ ...state, requests });
  }

  @Action(AddGroupMessage)
  addMessage(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, message }: AddGroupMessage,
  ) {
    const state = getState();

    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.messages = isSeenMessage(message)
            ? [
                ...group.messages.filter(x => !isSameSeenMessage(x, message)),
                message,
              ]
            : [...group.messages, message];
        }

        return group;
      }),
    });
  }

  @Action(AddGroupMessages)
  addMessages(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, messages, end }: AddGroupMessages,
  ) {
    const seenMessages = messages.filter(x => isSeenMessage(x));
    const state = getState();

    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.messages = end
            ? [
                ...group.messages.filter(
                  x => !isSameSeenInMessages(x, seenMessages),
                ),
                ...messages,
              ]
            : [...messages, ...group.messages];
        }

        return group;
      }),
    });
  }

  @Action(RemoveResponseGroupMessage)
  removeMessage(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, message }: RemoveResponseGroupMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.messages = group.messages.filter(
            x => !isSameMessageByDate(x, message),
          );
        }

        return group;
      }),
    });
  }

  @Action(RemoveOldAndAddNewResponseGroupMessage)
  removeOldAndAddNew(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, oldMessage, newMessage }: RemoveOldAndAddNewResponseGroupMessage,
  ) {
    const state = getState();
    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.messages = [
            ...group.messages.filter(x => !isSameMessageByDate(x, oldMessage)),
            newMessage,
          ];
        }

        return group;
      }),
    });
  }

  @Action(MarkResponseGroupMessageAsSent)
  markAsSent(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, message, apiMessages }: MarkResponseGroupMessageAsSent,
  ) {
    const state = getState();
    const apiMessage = apiMessages.find(x => isSameMessageByFields(x, message));
    const otherMessages = apiMessages.filter(
      x => !isSameMessageByDate(x, apiMessage),
    );

    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.messages = [
            ...group.messages
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
          ];
        }

        return group;
      }),
    });
  }

  @Action(MarkResponseGroupMessageAsFailed)
  markAsFailed(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId, message }: MarkResponseGroupMessageAsFailed,
  ) {
    const state = getState();
    setState({
      ...state,
      groups: state.groups.map(group => {
        if (group.id === groupId) {
          group.messages = group.messages.map(x => {
            if (isSameMessageByDate(x, message)) {
              return {
                ...x,
                attachmentUrl: message.attachmentUrl,
                sending: false,
                failed: true,
              };
            }

            return x;
          });
        }

        return group;
      }),
    });
  }

  @Action(RemoveMeeting)
  removeMeeting(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { meetingId }: RemoveMeeting,
  ) {
    const state = getState();
    setState({
      ...state,
      meetings: state.meetings.filter(x => x.id !== meetingId),
    });
  }

  @Action(RemoveRequest)
  removeRequest(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { requestId }: RemoveRequest,
  ) {
    const state = getState();
    setState({
      ...state,
      requests: state.requests.filter(x => x.id !== requestId),
    });
  }

  @Action(RemoveGroup)
  removeGroup(
    { getState, setState }: StateContext<MeetingsStateModel>,
    { groupId }: RemoveGroup,
  ) {
    const state = getState();
    setState({
      ...state,
      groups: state.groups.filter(x => x.id !== groupId),
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
