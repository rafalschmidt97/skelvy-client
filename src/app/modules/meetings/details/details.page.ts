import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToastService } from '../../../core/toast/toast.service';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MeetingsService } from '../meetings.service';
import { LoadingService } from '../../../core/loading/loading.service';
import {
  GroupState,
  GroupUserDto,
  GroupUserRole,
  MeetingDto,
} from '../meetings';
import { AlertModalComponent } from '../../../shared/components/alert/alert-modal/alert-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../core/i18n/translate';
import { SelfUserDto, UserDto } from '../../user/user';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GroupsService } from '../../groups/groups.service';
import { combineLatest, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GroupProfileModalComponent } from '../../../shared/components/modal/group-profile/group-profile-modal.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, OnDestroy {
  meeting: MeetingDto;
  group: GroupState;
  user: SelfUserDto;
  loadingAction = false;
  meeting$: Subscription;

  constructor(
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingsService,
    private readonly routerNavigation: NavController,
    private readonly storage: Storage,
    private readonly store: Store,
    private readonly translateService: TranslateService,
    private readonly groupsService: GroupsService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const meetingId = +this.route.snapshot.paramMap.get('id');

    if (!meetingId) {
      this.routerNavigation.navigateBack(['/app/tabs/meetings']);
    }

    this.meeting$ = combineLatest([
      this.store.select(state => state.meetings),
      this.store.select(state => state.user),
    ])
      .pipe(
        map(([meetingState, userState]) => {
          const meeting = meetingState.meetings.find(x => x.id === meetingId);

          if (!meeting) {
            this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          }

          return { meeting, groups: meetingState.groups, user: userState.user };
        }),
        map(({ meeting, groups, user }) => {
          const group = groups.find(x => x.id === meeting.groupId);

          if (!group) {
            this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          }

          return { meeting, group, user };
        }),
        tap(({ meeting, group, user }) => {
          this.meeting = meeting;
          this.group = group;
          this.user = user;
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.meeting$) {
      this.meeting$.unsubscribe();
    }
  }

  get filteredMeetingUsers(): GroupUserDto[] {
    return this.group.users.filter(user => user.id !== this.user.id);
  }

  async openDetails(user: UserDto) {
    const modal = await this.modalController.create({
      component: GroupProfileModalComponent,
      componentProps: {
        user,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }

  async openLeave() {
    if (!this.loadingAction) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant(
            'Are you sure you want to leave?',
          ),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        this.confirmLeave();
      }
    }
  }

  confirmLeave() {
    this.loadingAction = true;
    this.loadingService.lock();
    this.meetingService
      .leaveMeeting(this.meeting.id, this.meeting.groupId)
      .subscribe(
        () => {
          this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          this.loadingAction = false;
          this.loadingService.unlock();
        },
        (error: HttpErrorResponse) => {
          // data is not relevant (connection lost and reconnected)
          if (error.status === 404) {
            this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          }

          this.loadingAction = false;
          this.loadingService.unlock();
          this.toastService.createError(
            _('A problem occurred while leaving the meeting'),
          );
        },
      );
  }

  async openRemove() {
    if (!this.loadingAction) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant(
            'Are you sure you want to remove?',
          ),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        this.confirmRemove();
      }
    }
  }

  confirmRemove() {
    this.loadingAction = true;
    this.loadingService.lock();
    this.meetingService
      .removeMeeting(this.meeting.id, this.meeting.groupId)
      .subscribe(
        () => {
          this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          this.loadingAction = false;
          this.loadingService.unlock();
        },
        (error: HttpErrorResponse) => {
          // data is not relevant (connection lost and reconnected)
          if (error.status === 404) {
            this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          }

          this.loadingAction = false;
          this.loadingService.unlock();
          this.toastService.createError(
            _('A problem occurred while leaving the meeting'),
          );
        },
      );
  }

  showMessages() {
    this.routerNavigation
      .navigateForward(['/app/groups/', this.group.id, 'chat'])
      .then(async () => {
        await this.groupsService.readMessagesFromState(this.meeting.groupId);
      });
  }

  get isAdmin(): boolean {
    if (!this.group || !this.user) {
      return false;
    }
    const groupSelf = this.group.users.find(x => x.id === this.user.id);
    return groupSelf ? groupSelf.role === GroupUserRole.ADMIN : false;
  }

  get isOwner(): boolean {
    if (!this.group || !this.user) {
      return false;
    }
    const groupSelf = this.group.users.find(x => x.id === this.user.id);
    return groupSelf ? groupSelf.role === GroupUserRole.OWNER : false;
  }

  editMeeting() {
    this.routerNavigation.navigateForward([
      '/app/meetings/edit-meeting',
      { meetingId: this.meeting.id },
    ]);
  }
}
