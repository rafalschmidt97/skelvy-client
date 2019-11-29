import { Component, OnInit } from '@angular/core';
import { MeetingsStateModel } from '../store/meetings-state';
import { Store } from '@ngxs/store';
import { ToastService } from '../../../core/toast/toast.service';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MeetingsService } from '../meetings.service';
import { LoadingService } from '../../../core/loading/loading.service';
import { GroupState, MeetingDto } from '../meetings';
import { AlertModalComponent } from '../../../shared/components/alert/alert-modal/alert-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../core/i18n/translate';
import { SelfUserDto, UserDto } from '../../user/user';
import { ActivatedRoute } from '@angular/router';
import { ProfileDetailsModalComponent } from '../../../shared/components/profile-details-modal/profile-details-modal.component';
import { Storage } from '@ionic/storage';
import { GroupsService } from '../../groups/groups.service';
import { UserStateModel } from '../../user/store/user-state';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  meeting: MeetingDto;
  group: GroupState;
  user: SelfUserDto;
  loadingLeave = false;

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

    const meetingState: MeetingsStateModel = this.store.selectSnapshot(
      state => state.meetings,
    );

    const meeting = meetingState.meetings.find(x => x.id === meetingId);

    if (!meeting) {
      this.routerNavigation.navigateBack(['/app/tabs/meetings']);
    }

    const group = meetingState.groups.find(x => x.id === meeting.groupId);

    if (!group) {
      this.routerNavigation.navigateBack(['/app/tabs/meetings']);
    }

    const userState: UserStateModel = this.store.selectSnapshot(
      state => state.user,
    );

    this.meeting = meeting;
    this.group = group;
    this.user = userState.user;
  }

  get filteredMeetingUsers(): UserDto[] {
    return this.group.users.filter(user => user.id !== this.user.id);
  }
  async openDetails(user: UserDto) {
    const modal = await this.modalController.create({
      component: ProfileDetailsModalComponent,
      componentProps: {
        user,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }

  async openLeave() {
    if (!this.loadingLeave) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant('Are you sure?'),
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
    this.loadingLeave = true;
    this.loadingService.lock();
    this.meetingService
      .leaveMeeting(this.meeting.id, this.meeting.groupId)
      .subscribe(
        () => {
          this.loadingLeave = false;
          this.loadingService.unlock();
        },
        (error: HttpErrorResponse) => {
          // data is not relevant (connection lost and reconnected)
          if (error.status === 404) {
            this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          }

          this.loadingLeave = false;
          this.loadingService.unlock();
          this.toastService.createError(
            _('A problem occurred while leaving the meeting'),
          );
        },
      );
  }

  showMessages() {
    this.routerNavigation
      .navigateForward(['/app/groups/:id/chat', this.group.id])
      .then(async () => {
        await this.groupsService.readMessagesFromState(this.meeting.groupId);
      });
  }
}
