import { Component, Input } from '@angular/core';
import { GroupState, MeetingDto } from '../../meeting';
import { UserDto } from '../../../user/user';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { LoadingService } from '../../../../core/loading/loading.service';
import { MeetingService } from '../../meeting.service';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { ProfileDetailsModalComponent } from '../../../../shared/components/profile-details-modal/profile-details-modal.component';
import { AlertModalComponent } from '../../../../shared/components/alert/alert-modal/alert-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ChatService } from '../../../chat/chat.service';

@Component({
  selector: 'app-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.scss'],
})
export class FoundComponent {
  @Input() meeting: MeetingDto;
  @Input() group: GroupState;
  @Input() user: UserDto;
  @Input() loadingMeeting: boolean;
  @Input() messagesToRead: number;
  loadingLeave = false;

  constructor(
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingService,
    private readonly routerNavigation: NavController,
    private readonly storage: Storage,
    private readonly store: Store,
    private readonly translateService: TranslateService,
    private readonly chatService: ChatService,
  ) {}

  get filteredMeetingUsers(): UserDto[] {
    return this.group.users.filter(user => user.id !== this.user.id);
  }

  get missingMeetingUsers(): any[] {
    const amount = this.group.users.length;
    const missingAmount = 4 - amount; // 4 is max size of group
    const data = [];

    for (let i = 0; i < missingAmount; i++) {
      data.push(i);
    }

    return data;
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
            this.meetingService.findMeeting().subscribe();
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
    this.routerNavigation.navigateForward(['/app/chat']).then(async () => {
      await this.chatService.readMessagesFromState(this.meeting.groupId);
    });
  }
}
