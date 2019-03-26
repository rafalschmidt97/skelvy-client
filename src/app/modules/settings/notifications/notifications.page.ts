import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { UserPushService } from '../../profile/user-push.service';
import { NavController, Platform } from '@ionic/angular';
import { UserStoreService } from '../../profile/user-store.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = true;
  userId: number;
  platform: string;
  initializedAll: string;
  initializedPlatform: string;
  initializedUser: string;
  permissionDenied: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly storage: Storage,
    private readonly userPush: UserPushService,
    private readonly routerNavigation: NavController,
    userStore: UserStoreService,
    platform: Platform,
  ) {
    this.userId = userStore.data.id;
    this.platform = platform.is('android') ? 'android' : 'ios';

    this.form = this.formBuilder.group({
      all: false,
      platform: false,
      user: false,
    });
  }

  async ngOnInit() {
    this.initializedAll = await this.storage.get('pushTopicAll');
    this.initializedPlatform = await this.storage.get('pushTopicPlatform');
    this.initializedUser = await this.storage.get('pushTopicUser');

    this.form.patchValue({
      all: this.initializedAll,
      platform: this.initializedPlatform,
      user: this.initializedUser,
    });

    this.isLoading = false;
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.permissionDenied) {
      this.isLoading = true;
      const form = this.form.value;

      if (form.all !== this.initializedAll) {
        this.changeNotificationState(form.all, 'all', 'pushTopicAll');
      }

      if (form.platform !== this.initializedPlatform) {
        this.changeNotificationState(
          form.platform,
          this.platform,
          'pushTopicPlatform',
        );
      }

      if (form.user !== this.initializedUser) {
        this.changeNotificationState(
          form.user,
          'user-' + this.userId,
          'pushTopicUser',
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
