import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { UserPushService } from '../../user/user-push.service';
import { NavController, Platform } from '@ionic/angular';
import { storageKeys } from '../../../core/storage/storage';
import { Store } from '@ngxs/store';
import { Push } from '@ionic-native/push/ngx';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { BackgroundService } from '../../../core/background/background.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class NotificationsPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  loadingSettings = true;
  platform: string;
  initializedAll: string;
  initializedPlatform: string;
  initializedUser: string;
  hasPermission: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly storage: Storage,
    private readonly userPush: UserPushService,
    private readonly routerNavigation: NavController,
    private readonly store: Store,
    private readonly push: Push,
    private readonly toastService: ToastService,
    private readonly backgroundService: BackgroundService,
    platform: Platform,
  ) {
    this.platform = platform.is('android') ? 'android' : 'ios';

    this.form = this.formBuilder.group({
      all: false,
      platform: false,
      user: false,
    });
  }

  async ngOnInit() {
    await this.initialize();
  }

  async onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      const form = this.form.value;

      if (form.all !== this.initializedAll) {
        await this.changeNotificationState(
          form.all,
          'all',
          storageKeys.pushTopicAll,
        );
      }

      if (form.platform !== this.initializedPlatform) {
        await this.changeNotificationState(
          form.platform,
          this.platform,
          storageKeys.pushTopicPlatform,
        );
      }

      if (form.user !== this.initializedUser) {
        await this.changeNotificationState(
          form.user,
          'user-' + this.store.selectSnapshot(state => state.user.user.id),
          storageKeys.pushTopicUser,
        );

        this.backgroundService.allowPush = form.user;
      }

      this.routerNavigation.navigateBack(['/app/settings']);
    }
  }

  private async initialize() {
    const permission = await this.push.hasPermission();
    this.hasPermission = permission.isEnabled;
    this.initializedAll = await this.storage.get(storageKeys.pushTopicAll);
    this.initializedPlatform = await this.storage.get(
      storageKeys.pushTopicPlatform,
    );
    this.initializedUser = await this.storage.get(storageKeys.pushTopicUser);

    this.form.patchValue({
      all: this.initializedAll,
      platform: this.initializedPlatform,
      user: this.initializedUser,
    });

    this.loadingSettings = false;
  }

  private async changeNotificationState(
    value: any,
    topic: string,
    storageKey: string,
  ) {
    if (value === true) {
      await this.userPush.addTopic(topic, storageKey);
    } else {
      await this.userPush.removeTopic(topic, storageKey);
    }
  }
}
