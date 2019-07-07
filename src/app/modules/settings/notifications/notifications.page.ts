import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { UserPushService } from '../../user/user-push.service';
import { NavController, Platform } from '@ionic/angular';
import { UserState } from '../../user/store/user-state';
import { storageKeys } from '../../../core/storage/storage';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class NotificationsPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = true;
  userId: number;
  platform: string;
  initializedAll: string;
  initializedPlatform: string;
  initializedUser: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly storage: Storage,
    private readonly userPush: UserPushService,
    private readonly routerNavigation: NavController,
    userState: UserState,
    platform: Platform,
  ) {
    this.userId = userState.data.id;
    this.platform = platform.is('android') ? 'android' : 'ios';

    this.form = this.formBuilder.group({
      all: false,
      platform: false,
      user: false,
    });
  }

  async ngOnInit() {
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

    this.isLoading = false;
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      const form = this.form.value;

      if (form.all !== this.initializedAll) {
        this.changeNotificationState(form.all, 'all', storageKeys.pushTopicAll);
      }

      if (form.platform !== this.initializedPlatform) {
        this.changeNotificationState(
          form.platform,
          this.platform,
          storageKeys.pushTopicPlatform,
        );
      }

      if (form.user !== this.initializedUser) {
        this.changeNotificationState(
          form.user,
          'user-' + this.userId,
          storageKeys.pushTopicUser,
        );
      }

      setTimeout(() => {
        this.routerNavigation.navigateBack(['/app/tabs/settings']);
      }, 3000);
    }
  }

  private changeNotificationState(
    value: any,
    topic: string,
    storageKey: string,
  ) {
    if (value === true) {
      this.userPush.addTopic(topic, storageKey);
    } else {
      this.userPush.removeTopic(topic, storageKey);
    }
  }
}
