import { Component, OnInit } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserDto } from '../../user/user';
import { forkJoin, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { ModalController, NavController } from '@ionic/angular';
import { UserService } from '../../user/user.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, switchMap } from 'rxjs/operators';
import { MeetingsService } from '../meetings.service';

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

    this.store
      .select(state => state.user.friends)
      .pipe(
        switchMap((friends: UserDto[]) => {
          this.loadingFriends = true;

          return forkJoin([
            this.meetingService.findMeetingInvitationsDetails(meetingId),
            friends.length !== 0
              ? of(friends)
              : this.userService.findFriends(this.page),
          ]);
        }),
        mergeMap(([invited, friends]) => {
          this.page = friends.length / 10 + 1;

          if (friends.length > 0) {
            this.allFriendsLoaded = friends.length % 10 !== 0;
          } else {
            this.allFriendsLoaded = true;
          }

          if (invited.length !== 0) {
            return of(
              friends.filter(
                x => invited.find(y => y.invitedUser.id === x.id) === null,
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
      () => {
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
