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
  usersToInvite: UserDto[];
  loadingUsersToInvite = true;
  allUsersToInviteLoaded = false;
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
  ) {}

  ngOnInit() {
    const meetingId = +this.route.snapshot.paramMap.get('id');

    if (!meetingId) {
      this.routerNavigation.navigateBack(['/app/tabs/meetings']);
    }

    this.meetingId = meetingId;

    this.created = !!this.route.snapshot.paramMap.get('created');

    this.loadUsersToInvite();
  }

  loadUsersToInvite() {
    this.loadingUsersToInvite = true;
    this.meetingService
      .findUsersToInviteToMeeting(this.meetingId, this.page)
      .subscribe(
        users => {
          this.loadingUsersToInvite = false;
          this.page = this.page + 1;

          if (users.length > 0) {
            this.allUsersToInviteLoaded = users.length % 10 !== 0;
          } else {
            this.allUsersToInviteLoaded = true;
          }

          this.usersToInvite = users;
        },
        () => {
          this.loadingUsersToInvite = false;
          this.toastService.createError(
            _('A problem occurred while finding friends'),
          );
        },
      );
  }

  invite(userId: number) {
    this.meetingService.inviteToMeeting(userId, this.meetingId).subscribe(
      () => {
        const reducedFriends = this.usersToInvite.filter(x => x.id !== userId);

        if (reducedFriends.length === 0) {
          this.routerNavigation.navigateBack([
            '/app/meetings/details',
            this.meetingId,
          ]);
        } else {
          this.usersToInvite = reducedFriends;
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
