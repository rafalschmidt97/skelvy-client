import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MeetingDto } from '../../meeting';
import { ModalService } from '../../../../shared/modal/modal.service';
import { UserDto } from '../../../user/user';
import { Modal } from '../../../../shared/modal/modal';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { LoadingService } from '../../../../core/loading/loading.service';
import { MeetingService } from '../../meeting.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { storageKeys } from '../../../../core/storage/storage';
import { Store } from '@ngxs/store';
import { UpdateChatMessagesToRead } from '../../store/meeting-actions';

@Component({
  selector: 'app-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.scss'],
})
export class FoundComponent {
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  @Input() meeting: MeetingDto;
  @Input() user: UserDto;
  @Input() loadingMeeting: boolean;
  @Input() messagesToRead: number;
  userForModal: UserDto;
  modal: Modal;
  alert: Alert;
  loadingLeave = false;

  constructor(
    private readonly modalService: ModalService,
    private readonly alertService: AlertService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingService,
    private readonly routerNavigation: NavController,
    private readonly storage: Storage,
    private readonly store: Store,
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

  openDetails(user: UserDto) {
    this.userForModal = user;
    this.modal = this.modalService.show(this.detailsTemplate, true);
  }

  leaveGroup() {
    this.loadingLeave = false;
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmDetails() {
    this.modal.hide();
  }

  confirmAlert() {
    this.loadingLeave = true;
    this.loadingService.lock();
    this.meetingService.leaveMeeting().subscribe(
      () => {
        this.alert.hide();
        this.loadingService.unlock();
      },
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404) {
          this.meetingService.findMeeting().subscribe();
        }

        this.alert.hide();
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while leaving the meeting'),
        );
      },
    );
  }

  declineAlert() {
    this.alert.hide();
  }

  showMessages() {
    this.routerNavigation.navigateForward(['/app/chat']).then(() => {
      setTimeout(() => {
        this.store.dispatch(new UpdateChatMessagesToRead(0));
        const messages = this.store.selectSnapshot(
          state => state.meeting.meetingModel.messages,
        );
        if (messages.length > 0) {
          this.storage.set(
            storageKeys.lastMessageDate,
            messages[messages.length - 1].date,
          );
        }
      }, 1000);
    });
  }
}
