import { Injectable } from '@angular/core';
import { _ } from '../../core/i18n/translate';
import { ToastService } from '../../core/toast/toast.service';
import { Push } from '@ionic-native/push/ngx';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserPushService {
  constructor(
    private readonly push: Push,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
  ) {}

  initialize() {
    this.push.hasPermission();

    this.push.createChannel({
      id: 'push',
      description: 'Push Channel',
      importance: 3,
    });

    const push$ = this.getPushListener();

    push$.on('registration').subscribe((registration: any) => {
      console.log(registration.registrationId);
      // TODO: save topic subscription to storage for check on notifications
      // TODO: save registration id for check on notifications
    });

    push$.on('error').subscribe(() => {
      this.toastService.createError(
        _('A problem occurred while registering the device'),
      );
    });
  }

  addUserTopic(id: number) {
    this.addTopic('user-' + id);
  }

  removeUserTopic(id: number) {
    this.removeTopic('user-' + id);
  }

  getPushListener() {
    return this.push.init({
      android: {
        topics: ['all', 'android'],
      },
      ios: {
        alert: true,
        badge: true,
        sound: true,
        topics: ['all', 'ios'],
      },
    });
  }

  private addTopic(topic: string) {
    this.getPushListener()
      .subscribe(topic)
      .then(
        () => {},
        () => {
          this.toastService.createError(
            _('A problem occurred while adding a push notification topic'),
          );
        },
      );
  }

  private removeTopic(topic: string) {
    this.getPushListener()
      .unsubscribe(topic)
      .then(
        () => {},
        () => {
          this.toastService.createError(
            _('A problem occurred while removing a push notification topic'),
          );
        },
      );
  }
}
