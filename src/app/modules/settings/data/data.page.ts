import { Component } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { LoadingService } from '../../../core/loading/loading.service';
import { UserService } from '../../user/user.service';
import { MeetingsService } from '../../meetings/meetings.service';
import { SelfService } from '../../user/self.service';
import { Storage } from '@ionic/storage';
import { SessionService } from '../../../core/auth/session.service';
import { storageKeys } from '../../../core/storage/storage';
import { SettingsService } from '../settings.service';
import { Store } from '@ngxs/store';
import { ClearState } from '../../../core/redux/redux';
import { tap } from 'rxjs/operators';
import { Connection } from '../../../core/state/global-state';
import { ChangeConnectionStatus } from '../../../core/state/global-actions';
import { AlertModalComponent } from '../../../shared/components/alert/alert-modal/alert-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class DataPage {
  isLoading = false;

  constructor(
    private readonly toastService: ToastService,
    private readonly modalController: ModalController,
    private readonly translateService: TranslateService,
    private readonly loadingService: LoadingService,
    private readonly userService: UserService,
    private readonly meetingService: MeetingsService,
    private readonly selfService: SelfService,
    private readonly storage: Storage,
    private readonly sessionService: SessionService,
    private readonly settingsService: SettingsService,
    private readonly store: Store,
  ) {}

  async refreshUser() {
    if (!this.isLoading) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant(
            'Are you sure you want to force to reload user data?',
          ),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        this.confirmRefreshUser();
      }
    }
  }

  confirmRefreshUser() {
    this.isLoading = true;
    this.loadingService.lock();
    this.userService.findSelf().subscribe(
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
      },
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while finding the user'),
        );
      },
    );
  }

  async refreshMeetings() {
    if (!this.isLoading) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant(
            'Are you sure you want to force to reload meeting data?',
          ),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        this.confirmRefreshMeetings();
      }
    }
  }

  confirmRefreshMeetings() {
    this.isLoading = true;
    this.loadingService.lock();
    combineLatest([
      this.meetingService.findMeetings(),
      this.meetingService.findRequests(true),
    ]).subscribe(
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
      },
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while finding the meeting'),
        );
      },
    );
  }

  async refreshBlockedUsers() {
    if (!this.isLoading) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant(
            'Are you sure you want to force to reload blocked users data?',
          ),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        this.confirmRefreshBlockedUsers();
      }
    }
  }

  confirmRefreshBlockedUsers() {
    this.isLoading = true;
    this.loadingService.lock();
    this.settingsService.findBlockedUsers().subscribe(
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
      },
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while finding the user'),
        );
      },
    );
  }

  async refreshAll() {
    if (!this.isLoading) {
      const modal = await this.modalController.create({
        component: AlertModalComponent,
        componentProps: {
          title: this.translateService.instant(
            'Are you sure you want to remove all stored data and reload everything?',
          ),
        },
        cssClass: 'ionic-modal ionic-action-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data && data.response) {
        await this.confirmRefreshAll();
      }
    }
  }

  async confirmRefreshAll() {
    this.isLoading = true;
    this.loadingService.lock();

    this.clearState();
    await this.clearStorage();

    combineLatest([
      this.userService.findSelf(),
      this.selfService.sync(),
    ]).subscribe(
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
      },
      () => {
        this.isLoading = false;
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while retrieving new data'),
        );
      },
    );
  }

  private clearState() {
    this.store
      .dispatch(new ClearState())
      .pipe(
        tap(() => {
          this.store.dispatch(new ChangeConnectionStatus(Connection.CONNECTED));
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
}
