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
import { storageKeys } from '../../../core/storage/storage';
import { SettingsService } from '../settings.service';
import { Store } from '@ngxs/store';
import { ClearState } from '../../../core/redux/redux';
import { tap } from 'rxjs/operators';
import { GlobalState } from '../../../core/state/global-state';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class DataPage {
  @ViewChild('alertRefreshUser') alertUser: TemplateRef<any>;
  @ViewChild('alertRefreshMeeting') alertMeeting: TemplateRef<any>;
  @ViewChild('alertClearAll') alertAll: TemplateRef<any>;
  @ViewChild('alertBlockedUsers') alertBlockedUsers: TemplateRef<any>;
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
    private readonly settingsService: SettingsService,
    private readonly store: Store,
    private readonly globalState: GlobalState,
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

  refreshBlockedUsers() {
    this.loadingData = false;
    this.alert = this.alertService.show(this.alertBlockedUsers);
  }

  confirmRefreshBlockedUsers() {
    if (!this.loadingData) {
      this.loadingData = true;
      this.loadingService.lock();
      this.settingsService.findBlockedUsers().subscribe(
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

  refreshAll() {
    this.loadingData = false;
    this.alert = this.alertService.show(this.alertAll);
  }

  async confirmRefreshAll() {
    if (!this.loadingData) {
      this.loadingData = true;
      this.loadingService.lock();

      this.clearState();
      await this.clearStorage();

      this.selfService.findSelf().subscribe(
        () => {
          this.alert.hide();
          this.loadingService.unlock();
        },
        () => {
          this.alert.hide();
          this.loadingService.unlock();
          this.toastService.createError(
            _('A problem occurred while retrieving new data'),
          );
        },
      );
    }
  }

  private clearState() {
    this.store
      .dispatch(new ClearState())
      .pipe(
        tap(() => {
          this.globalState.markConnectionAsConnected();
        }),
      )
      .subscribe();
  }

  private async clearStorage() {
    const token = await this.sessionService.getSession();
    const language = await this.storage.get(storageKeys.language);
    const signInMethod = await this.storage.get(storageKeys.signInMethod);
    const push = await this.storage.get(storageKeys.push);
    const pushAll = await this.storage.get(storageKeys.pushTopicAll);
    const pushPlatform = await this.storage.get(storageKeys.pushTopicPlatform);
    const pushUser = await this.storage.get(storageKeys.pushTopicUser);
    await this.storage.clear();
    await this.sessionService.createSession(token);
    await this.storage.set(storageKeys.language, language);
    await this.storage.set(storageKeys.signInMethod, signInMethod);
    await this.storage.set(storageKeys.push, push);
    await this.storage.set(storageKeys.pushTopicAll, pushAll);
    await this.storage.set(storageKeys.pushTopicPlatform, pushPlatform);
    await this.storage.set(storageKeys.pushTopicUser, pushUser);
  }

  declineAlert() {
    this.alert.hide();
  }
}
