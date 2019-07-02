import { Component, TemplateRef, ViewChild } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { AlertService } from '../../../shared/alert/alert.service';
import { LoadingService } from '../../../core/loading/loading.service';
import { Alert } from '../../../shared/alert/alert';
import { UserService } from '../../user/user.service';
import { MeetingService } from '../../meeting/meeting.service';
import { SelfService } from '../../user/self.service';
import { Storage } from '@ionic/storage';
import { SessionService } from '../../../core/auth/session.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage {
  @ViewChild('alertRefreshUser') alertUser: TemplateRef<any>;
  @ViewChild('alertRefreshMeeting') alertMeeting: TemplateRef<any>;
  @ViewChild('alertClearAll') alertAll: TemplateRef<any>;
  alert: Alert;
  loadingData = false;

  constructor(
    private readonly toastService: ToastService,
    private readonly alertService: AlertService,
    private readonly loadingService: LoadingService,
    private readonly userService: UserService,
    private readonly meetingService: MeetingService,
    private readonly selfService: SelfService,
    private readonly storage: Storage,
    private readonly sessionService: SessionService,
  ) {}

  refreshUser() {
    this.loadingData = false;
    this.alert = this.alertService.show(this.alertUser);
  }

  confirmRefreshUser() {
    if (!this.loadingData) {
      this.loadingData = true;
      this.loadingService.lock();
      this.userService.findUser().subscribe(
        () => {
          this.alert.hide();
          this.loadingService.unlock();
        },
        () => {
          this.alert.hide();
          this.loadingService.unlock();
          this.toastService.createError(
            _('A problem occurred while finding the user'),
          );
        },
      );
    }
  }

  refreshMeeting() {
    this.loadingData = false;
    this.alert = this.alertService.show(this.alertMeeting);
  }

  confirmRefreshMeeting() {
    if (!this.loadingData) {
      this.loadingData = true;
      this.loadingService.lock();
      this.meetingService.findMeeting(false, false).subscribe(
        () => {
          this.alert.hide();
          this.loadingService.unlock();
        },
        () => {
          this.alert.hide();
          this.loadingService.unlock();
          this.toastService.createError(
            _('A problem occurred while finding the meeting'),
          );
        },
      );
    }
  }

  refreshAll() {
    this.loadingData = false;
    this.alert = this.alertService.show(this.alertAll);
  }

  async confirmRefreshAll() {
    if (!this.loadingData) {
      this.loadingData = true;
      this.loadingService.lock();
      const token = await this.sessionService.getSession();
      await this.storage.clear();
      await this.sessionService.createSession(token);
      this.selfService.findSelf().subscribe(
        () => {
          this.alert.hide();
          this.loadingService.unlock();
        },
        () => {
          this.alert.hide();
          this.loadingService.unlock();
          this.toastService.createError(
            _('A problem occurred while finding the user'),
          );
        },
      );
    }
  }

  declineAlert() {
    this.alert.hide();
  }
}
