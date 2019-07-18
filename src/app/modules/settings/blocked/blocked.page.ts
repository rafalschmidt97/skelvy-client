import { Component, OnInit } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserDto } from '../../user/user';
import { LoadingService } from '../../../core/loading/loading.service';
import { SettingsService } from '../settings.service';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ProfileDetailsModalComponent } from '../../../shared/components/profile-details-modal/profile-details-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class BlockedPage implements OnInit {
  @Select(x => x.settings.blockedUsers) blockedUsers$: Observable<UserDto[]>;
  loadingBlocked = true;
  loadingBlockedMore = false;
  allBlockedLoaded = false;
  page = 1;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    const blockedUsers = this.store.selectSnapshot(
      state => state.settings.blockedUsers,
    );
    if (!blockedUsers) {
      this.loadBlockedUsers();
    } else {
      this.loadingBlocked = false;
      const blockedUsersAmount = blockedUsers.length;
      this.page =
        blockedUsersAmount % 10 !== 0
          ? blockedUsersAmount / 10 + 1
          : blockedUsersAmount / 10;
      this.allBlockedLoaded = blockedUsers.length % 10 !== 0;
    }
  }

  loadBlockedUsers() {
    this.loadingBlocked = true;
    this.settingsService.findBlockedUsers().subscribe(
      blockedUsers => {
        this.loadingBlocked = false;
        this.allBlockedLoaded = blockedUsers.length % 10 !== 0;

        if (this.page !== 1) {
          this.page = 1;
        }
      },
      () => {
        this.loadingBlocked = false;
        this.toastService.createError(
          _('A problem occurred while finding blocked users'),
        );
      },
    );
  }

  loadMoreBlockedUsers() {
    this.page = this.page + 1;
    this.loadingBlockedMore = true;
    this.settingsService.findBlockedUsers(this.page).subscribe(
      blockedUsers => {
        this.loadingBlockedMore = false;

        if (blockedUsers.length > 0) {
          this.allBlockedLoaded = blockedUsers.length % 10 !== 0;
        } else {
          this.allBlockedLoaded = true;
        }
      },
      () => {
        this.loadingBlockedMore = false;
        this.allBlockedLoaded = true;
        this.toastService.createError(
          _('A problem occurred while finding blocked users'),
        );
      },
    );
  }

  async openDetails(user: UserDto) {
    const modal = await this.modalController.create({
      component: ProfileDetailsModalComponent,
      componentProps: {
        user,
        blocked: true,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }
}
