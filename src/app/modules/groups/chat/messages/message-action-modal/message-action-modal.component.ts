import { Component, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MessageState } from '../../../../meetings/meetings';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../../../core/i18n/translate';
import { GroupsService } from '../../../groups.service';
import { MeetingsService } from '../../../../meetings/meetings.service';
import { ToastService } from '../../../../../core/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-action-modal',
  templateUrl: './message-action-modal.component.html',
})
export class MessageActionModalComponent {
  @Input() message: MessageState;

  constructor(
    private readonly modalController: ModalController,
    private readonly groupsService: GroupsService,
    private readonly meetingService: MeetingsService,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  sendAgain(oldMessage: MessageState) {
    this.dismiss();
    this.groupsService.sendAgainMessage(oldMessage).subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404 || error.status === 409) {
          this.meetingService.findMeetings().subscribe();
          this.routerNavigation.navigateBack(['/app/tabs/meetings']);

          this.toastService.createError(
            _('A problem occurred while sending the message'),
          );
        }
      },
    );
  }

  remove(message: MessageState) {
    this.dismiss();
    this.groupsService.removeMessage(message);
  }
}
