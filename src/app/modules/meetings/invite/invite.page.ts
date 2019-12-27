import { Component, OnInit } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserDto } from '../../user/user';
import { combineLatest, forkJoin, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { ModalController, NavController } from '@ionic/angular';
import { UserService } from '../../user/user.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, switchMap } from 'rxjs/operators';
import { MeetingsService } from '../meetings.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingsStateModel } from '../store/meetings-state';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {
  reducedFriends: UserDto[];
  loadingFriends = true;
  allFriendsLoaded = false;
  page = 1;
  meetingId: number;
  created: boolean;

  constructor(
    private readonly userService: UserService,
    private readonly meetingService: MeetingsService,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly routerNavigation: NavController,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    const meetingId = +this.route.snapshot.paramMap.get('id');

    if (!meetingId) {
      this.routerNavigation.navigateBack(['/app/tabs/meetings']);
    }

    this.meetingId = meetingId;

    this.created = !!this.route.snapshot.paramMap.get('created');

    combineLatest([
      this.store.selectOnce(state => state.user.friends),
      this.store.selectOnce(state => state.meetings),
    ])
      .pipe(
        switchMap(
          ([friends, meetingsState]: [UserDto[], MeetingsStateModel]) => {
            this.loadingFriends = true;
            const meeting = meetingsState.meetings.find(
              x => x.id === meetingId,
            );

            return forkJoin([
              this.meetingService.findMeetingInvitationsDetails(meetingId),
              friends.length !== 0
                ? of(friends)
                : this.userService.findFriends(this.page),
              of(meetingsState.groups.find(x => x.id === meeting.groupId)),
            ]);
          },
        ),
        mergeMap(([invited, friends, group]) => {
          this.page = friends.length / 10 + 1;

          if (friends.length > 0) {
            this.allFriendsLoaded = friends.length % 10 !== 0;
          } else {
            this.allFriendsLoaded = true;
          }

          if (invited.length !== 0) {
            return of(
              friends.filter(
                x =>
                  invited.find(y => y.invitedUser.id === x.id) == null &&
                  group.users.find(y => y.id === x.id) == null,
              ),
            );
          } else {
            return of(friends);
          }
        }),
      )
      .subscribe(reducedFriends => {
        this.loadingFriends = false;
        this.reducedFriends = reducedFriends;
      });
  }

  loadFriends() {
    this.loadingFriends = true;
    this.userService.findFriends(this.page).subscribe(
      () => {},
      () => {
        this.loadingFriends = false;
        this.toastService.createError(
          _('A problem occurred while finding friends'),
        );
      },
    );
  }

  invite(userId: number) {
    this.meetingService.inviteToMeeting(userId, this.meetingId).subscribe(
      () => {
        const reducedFriends = this.reducedFriends.filter(x => x.id !== userId);

        if (reducedFriends.length === 0) {
          this.routerNavigation.navigateBack([
            '/app/meetings/details',
            this.meetingId,
          ]);
        } else {
          this.reducedFriends = reducedFriends;
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.userService.findFriends().subscribe();
        }

        this.toastService.createError(
          _('A problem occurred while inviting a friend'),
        );

        this.routerNavigation.navigateBack([
          '/app/meetings/details',
          this.meetingId,
        ]);
      },
    );
  }

  moveToMeeting() {
    this.routerNavigation.navigateBack([
      '/app/meetings/details',
      this.meetingId,
    ]);
  }
}
