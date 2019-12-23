import { Component, OnInit } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { RelationType, UserDto } from '../../user/user';
import { LoadingService } from '../../../core/loading/loading.service';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { ProfileModalComponent } from '../../../shared/components/modal/profile/profile-modal.component';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class BlockedPage implements OnInit {
  @Select(state => state.user.blockedUsers) blockedUsers$: Observable<
    UserDto[]
  >;
  loadingBlocked = true;
  loadingBlockedMore = false;
  allBlockedLoaded = false;
  page = 1;
  relations = RelationType;

  constructor(
    private readonly userService: UserService,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    const blockedUsers = this.store.selectSnapshot(
      state => state.user.blockedUsers,
    );
    if (!blockedUsers || blockedUsers.length === 0) {
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
    this.userService.findBlockedUsers().subscribe(
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
    this.userService.findBlockedUsers(this.page).subscribe(
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
      component: ProfileModalComponent,
      componentProps: {
        user,
        openingUser: this.store.selectSnapshot(state => state.user.user),
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }
}
