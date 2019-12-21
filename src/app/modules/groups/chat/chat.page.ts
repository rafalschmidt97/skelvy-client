import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { GroupState } from '../../meetings/meetings';
import { SelfUserDto } from '../../user/user';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AlertModalComponent } from '../../../shared/components/alert/alert-modal/alert-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { LoadingService } from '../../../core/loading/loading.service';
import { GroupsService } from '../groups.service';
import { TranslateService } from '@ngx-translate/core';
import { MeetingsService } from '../../meetings/meetings.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  group: GroupState;
  user: SelfUserDto;
  group$: Subscription;
  isLoading: boolean;
  loadingAction: boolean;
  isNotMeeting: boolean;
  meetingId: number;

  constructor(
    private readonly routerNavigation: NavController,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly groupService: GroupsService,
    private readonly meetingService: MeetingsService,
    private readonly translateService: TranslateService,
  ) {}

  ngOnInit() {
    const groupId = +this.route.snapshot.paramMap.get('id');

    if (!groupId) {
      this.routerNavigation.navigateBack(['/app/tabs/meetings']);
    }

    this.group$ = combineLatest([
      this.store.select(state => state.meetings),
      this.store.select(state => state.user),
    ])
      .pipe(
        map(([meetingState, userState]) => {
          const group = meetingState.groups.find(x => x.id === groupId);

          if (!group) {
            this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          }

          const meeting = meetingState.meetings.find(
            x => x.groupId === groupId,
          );

          return {
            isLoading: meetingState.loading,
            group,
            user: userState.user,
            meeting,
          };
        }),
        tap(({ isLoading, group, user, meeting }) => {
          this.isLoading = isLoading;
          this.group = group;
          this.user = user;
          this.isNotMeeting = !!!meeting;
          this.meetingId = meeting ? meeting.id : null;
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.group$) {
      this.group$.unsubscribe();
    }
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
    this.groupService.leaveGroup(this.group.id).subscribe(
      () => {
        this.routerNavigation.navigateBack(['/app/tabs/groups']);
        this.loadingAction = false;
        this.loadingService.unlock();
      },
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404) {
          this.routerNavigation.navigateBack(['/app/tabs/groups']);
          this.meetingService.findMeetings().subscribe();
        }

        this.loadingAction = false;
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while leaving the gorup'),
        );
      },
    );
  }

  seeMeeting() {
    if (this.meetingId) {
      this.routerNavigation.navigateForward([
        '/app/meetings/details',
        this.meetingId,
      ]);
    }
  }
}
