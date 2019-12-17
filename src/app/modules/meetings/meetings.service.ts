import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import {
  ActivityDto,
  ConnectRequest,
  GroupUserRole,
  MeetingDto,
  MeetingModel,
  MeetingRequest,
  MeetingRequestDto,
  MeetingRequestRequest,
  MeetingSuggestionsModel,
} from './meetings';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MeetingInvitation, UserDto } from '../user/user';
import { Store } from '@ngxs/store';
import {
  AddGroupUser,
  AddMeeting,
  ChangeMeetingLoadingStatus,
  RemoveGroup,
  RemoveGroupUser,
  RemoveMeeting,
  RemoveRequest,
  UpdateMeeting,
  UpdateMeetingFromRequest,
  UpdateMeetingsFromModel,
  UpdateMeetingUserRole,
  UpdateRequests,
} from './store/meetings-actions';
import {
  ChangeExploreLoadingStatus,
  RemoveExploreMeeting,
  RemoveExploreRequest,
  UpdateExploreState,
} from '../explore/store/explore-actions';
import {
  RemoveMeetingInvitation,
  UpdateMeetingInvitations,
} from '../settings/store/settings-actions';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  findMeetings(markedAsLoading: boolean = false): Observable<MeetingModel> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<MeetingModel>(
        `${environment.versionApiUrl}meetings/self?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(model => {
          this.store.dispatch(
            new UpdateMeetingsFromModel(model.meetings, model.groups),
          );
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          // TODO: set not red messages
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  syncMeeting(
    id: number,
    markedAsLoading: boolean = false,
  ): Observable<MeetingDto> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<MeetingDto>(
        `${environment.versionApiUrl}meetings/${id}?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(meeting => {
          this.store.dispatch(new UpdateMeeting(meeting));
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          // TODO: set not red messages
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  addFoundMeeting(
    id: number,
    markedAsLoading: boolean = false,
  ): Observable<MeetingDto> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<MeetingDto>(
        `${environment.versionApiUrl}meetings/${id}?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(meeting => {
          this.store.dispatch(new AddMeeting(meeting));
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          // TODO: set not red messages
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  findRequests(
    markedAsLoading: boolean = false,
  ): Observable<MeetingRequestDto[]> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeMeetingLoadingStatus(true));
    }

    return this.http
      .get<MeetingRequestDto[]>(
        `${environment.versionApiUrl}requests/self?language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(requests => {
          this.store.dispatch(new UpdateRequests(requests));
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
        }),
        catchError(error => {
          this.store.dispatch(new ChangeMeetingLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  leaveMeeting(meetingId: number, groupId: number): Observable<void> {
    return this.http
      .post<void>(
        `${environment.versionApiUrl}meetings/${meetingId}/leave`,
        null,
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveMeeting(meetingId));
          this.store.dispatch(new RemoveGroup(groupId));
          // TODO: remove red messages date
        }),
      );
  }

  removeMeeting(meetingId: number, groupId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.versionApiUrl}meetings/${meetingId}`)
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveMeeting(meetingId));
          this.store.dispatch(new RemoveGroup(groupId));
          // TODO: remove red messages date
        }),
      );
  }

  createMeetingRequest(request: MeetingRequestRequest): Observable<void> {
    return this.http.post<void>(
      environment.versionApiUrl + 'requests',
      request,
    );
  }

  removeMeetingRequest(requestId: number): Observable<void> {
    return this.http
      .delete<void>(`${environment.versionApiUrl}requests/${requestId}`)
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveRequest(requestId));
        }),
      );
  }

  createMeeting(request: MeetingRequest): Observable<void> {
    return this.http.post<void>(
      environment.versionApiUrl + 'meetings',
      request,
    );
  }

  updateMeeting(
    meetingId: number,
    request: MeetingRequest,
    activity: ActivityDto,
    city: string,
  ): Observable<void> {
    return this.http
      .put<void>(`${environment.versionApiUrl}meetings/${meetingId}`, request)
      .pipe(
        tap(() => {
          this.store.dispatch(
            new UpdateMeetingFromRequest(meetingId, request, activity, city),
          );
        }),
      );
  }

  updateMeetingUserRole(
    meetingId: number,
    groupId: number,
    updatedUserId: number,
    role: GroupUserRole,
  ): Observable<void> {
    return this.http
      .patch<void>(
        `${environment.versionApiUrl}meetings/${meetingId}/users/${updatedUserId}/role`,
        { role },
      )
      .pipe(
        tap(() => {
          this.store.dispatch(
            new UpdateMeetingUserRole(groupId, updatedUserId, role),
          );
        }),
      );
  }

  findActivities(): Observable<ActivityDto[]> {
    return this.http.get<ActivityDto[]>(
      environment.versionApiUrl + 'activities',
    );
  }

  findMeetingSuggestions(
    latitude: number,
    longitude: number,
    markedAsLoading: boolean = false,
  ): Observable<MeetingSuggestionsModel> {
    if (!markedAsLoading) {
      this.store.dispatch(new ChangeExploreLoadingStatus(true));
    }

    return this.http
      .get<MeetingSuggestionsModel>(
        `${environment.versionApiUrl}meetings/self/suggestions` +
          `?latitude=${latitude}&longitude=${longitude}&language=${this.translateService.currentLang}`,
      )
      .pipe(
        tap(model => {
          this.store.dispatch(
            new UpdateExploreState(model.meetingRequests, model.meetings),
          );
          this.store.dispatch(new ChangeExploreLoadingStatus(false));
        }),
        catchError(error => {
          this.store.dispatch(new ChangeExploreLoadingStatus(false));
          return throwError(error);
        }),
      );
  }

  joinMeeting(meetingId: number): Observable<void> {
    return this.http
      .post<void>(
        `${environment.versionApiUrl}meetings/${meetingId}/join`,
        null,
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveExploreMeeting(meetingId));
        }),
      );
  }

  connectMeetingRequest(
    requestId: number,
    request: ConnectRequest,
  ): Observable<void> {
    return this.http
      .post<void>(
        `${environment.versionApiUrl}requests/${requestId}/connect`,
        request,
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveExploreRequest(requestId));
        }),
      );
  }

  findUser(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(
      `${environment.versionApiUrl}users/${userId}`,
    );
  }

  addUser(
    userId: number,
    groupId: number,
    role: GroupUserRole,
  ): Observable<UserDto> {
    return this.findUser(userId).pipe(
      tap(user => {
        this.store.dispatch(new AddGroupUser(groupId, { ...user, role }));
      }),
    );
  }

  removeUser(userId: number, groupId: number) {
    this.store.dispatch(new RemoveGroupUser(groupId, userId));
  }

  clearMeeting(meetingId: number, groupId: number) {
    this.store.dispatch(new RemoveMeeting(meetingId));
    this.store.dispatch(new RemoveGroup(groupId));
  }

  clearMeetingRequest(requestId: number) {
    this.store.dispatch(new RemoveRequest(requestId));
  }

  updatedUserRole(groupId: number, updatedUserId: number, role: GroupUserRole) {
    this.store.dispatch(
      new UpdateMeetingUserRole(groupId, updatedUserId, role),
    );
  }

  findMeetingInvitations(): Observable<MeetingInvitation[]> {
    return this.http
      .get<MeetingInvitation[]>(
        `${environment.versionApiUrl}meetings/self/invitations`,
      )
      .pipe(
        tap(invitations => {
          this.store.dispatch(new UpdateMeetingInvitations(invitations));
        }),
      );
  }

  inviteToMeeting(userId: number, meetingId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.versionApiUrl}meetings/self/invitations`,
      {
        invitingUserId: userId,
        meetingId: meetingId,
      },
    );
  }

  respondMeetingInvitation(
    invitationId: number,
    isAccepted: boolean,
  ): Observable<void> {
    return this.http
      .post<void>(
        `${environment.versionApiUrl}meetings/self/invitations/${invitationId}/respond`,
        {
          isAccepted,
        },
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveMeetingInvitation(invitationId));
        }),
      );
  }

  removeFromGroup(userId: number, meetingId: number, groupId: number) {
    return this.http
      .delete<void>(
        `${environment.versionApiUrl}meetings/${meetingId}/users/${userId}`,
      )
      .pipe(
        tap(() => {
          this.store.dispatch(new RemoveGroupUser(groupId, userId));
        }),
      );
  }
}
