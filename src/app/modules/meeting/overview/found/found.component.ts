import { Component, Input } from '@angular/core';
import { MeetingDto } from '../../meeting';
import { UserDto } from '../../../user/user';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { LoadingService } from '../../../../core/loading/loading.service';
import { MeetingService } from '../../meeting.service';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { storageKeys } from '../../../../core/storage/storage';
import { Store } from '@ngxs/store';
import { UpdateChatMessagesToRead } from '../../store/meeting-actions';
import { ProfileDetailsModalComponent } from '../../../../shared/components/profile-details-modal/profile-details-modal.component';
import { AlertModalComponent } from '../../../../shared/components/alert/alert-modal/alert-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.scss'],
})
export class FoundComponent {
  @Input() meeting: MeetingDto;
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
  ) {}

  get filteredMeetingUsers(): UserDto[] {
    return this.meeting.users.filter(user => user.id !== this.user.id);
  }

  get missingMeetingUsers(): any[] {
    const amount = this.meeting.users.length;
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
    this.meetingService.leaveMeeting().subscribe(
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
    this.routerNavigation.navigateForward(['/app/chat']).then(() => {
      setTimeout(async () => {
        this.store.dispatch(new UpdateChatMessagesToRead(0));
        const messages = this.store.selectSnapshot(
          state => state.meeting.meetingModel.messages,
        );
        if (messages.length > 0) {
          await this.storage.set(
            storageKeys.lastMessageDate,
            messages[messages.length - 1].date,
          );
        }
      }, 1000);
    });
  }
}
