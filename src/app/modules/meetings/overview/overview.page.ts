import { Component } from '@angular/core';
import { MeetingsStateModel } from '../store/meetings-state';
import { combineLatest, Observable } from 'rxjs';
import { UserStateModel } from '../../user/store/user-state';
import { Select } from '@ngxs/store';
import * as moment from 'moment';
import { AlertModalComponent } from '../../../shared/components/alert/alert-modal/alert-modal.component';
import { ToastService } from '../../../core/toast/toast.service';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MeetingsService } from '../meetings.service';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../core/i18n/translate';
import { LoadingService } from '../../../core/loading/loading.service';
import { GroupState } from '../meetings';
import { MeetingInvitation } from '../../user/user';
import { MeetingInvitationModalComponent } from './invitation-modal/meeting-invitation-modal.component';
import { tap } from 'rxjs/operators';
import { GroupsService } from '../../groups/groups.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @Select(state => state.meetings) $meetings: Observable<MeetingsStateModel>;
  @Select(state => state.user) user$: Observable<UserStateModel>;

  constructor(
    private readonly toastService: ToastService,
    private readonly modalController: ModalController,
    private readonly translateService: TranslateService,
    private readonly meetingService: MeetingsService,
    private readonly groupsService: GroupsService,
    private readonly loadingService: LoadingService,
  ) {}

  getDate(minDate: string | Date, maxDate: string | Date): string {
    if (maxDate !== minDate) {
      return `${moment(minDate).format('DD.MM.YYYY')} - ${moment(
        maxDate,
      ).format('DD.MM.YYYY')}`;
    }

    return moment(minDate).format('DD.MM.YYYY');
  }

  getGroup(groupId: number, groups: GroupState[]): GroupState {
    return groups.find(x => x.id === groupId);
  }

  async removeRequestAlert(id: number) {
    {
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
        this.removeRequest(id);
      }
    }
  }

  private removeRequest(id: number) {
    this.loadingService.lock();
    this.meetingService.removeMeetingRequest(id).subscribe(
      () => {
        this.loadingService.unlock();
      },
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404) {
          this.meetingService.findRequests().subscribe();
        }

        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while removing the request'),
        );
      },
    );
  }

  async openInvitation(invitation: MeetingInvitation) {
    const modal = await this.modalController.create({
      component: MeetingInvitationModalComponent,
      componentProps: {
        invitation,
      },
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.invitationId) {
      this.meetingService
        .respondMeetingInvitation(data.invitationId, data.accept)
        .pipe(
          tap(() => {
            if (data.accept) {
              combineLatest([
                this.meetingService.addFoundMeeting(invitation.meeting.id),
                this.groupsService.addFoundGroup(
                  invitation.meeting.groupId,
                  true,
                ),
              ]).subscribe(
                () => {},
                () => {
                  this.toastService.createError(
                    _('A problem occurred while finding the meeting'),
                  );
                },
              );
            }
          }),
        )
        .subscribe();
    }
  }
}
