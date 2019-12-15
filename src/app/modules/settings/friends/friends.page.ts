import { Component, OnInit } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { FriendInvitation, RelationType, UserDto } from '../../user/user';
import { LoadingService } from '../../../core/loading/loading.service';
import { SettingsService } from '../settings.service';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ProfileDetailsModalComponent } from '../../../shared/components/profile-details-modal/profile-details-modal.component';
import { ModalController } from '@ionic/angular';
import { FriendInvitationModalComponent } from './invitation-modal/invitation-modal.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class FriendsPage implements OnInit {
  @Select(x => x.settings.friends) friends$: Observable<UserDto[]>;
  @Select(x => x.settings.friendInvitations) friendInvitations$: Observable<
    FriendInvitation[]
  >;
  loadingFriends = true;
  loadingFriendsMore = false;
  allFriendsLoaded = false;
  page = 1;
  relations = RelationType;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    const friends = this.store.selectSnapshot(state => state.settings.friends);
    if (!friends || friends.length === 0) {
      this.loadFriends();
    } else {
      this.loadingFriends = false;
      const blockedUsersAmount = friends.length;
      this.page =
        blockedUsersAmount % 10 !== 0
          ? blockedUsersAmount / 10 + 1
          : blockedUsersAmount / 10;
      this.allFriendsLoaded = friends.length % 10 !== 0;
    }
  }

  loadFriends() {
    this.loadingFriends = true;
    this.settingsService.findFriends().subscribe(
      friends => {
        this.loadingFriends = false;
        this.allFriendsLoaded = friends.length % 10 !== 0;

        if (this.page !== 1) {
          this.page = 1;
        }
      },
      () => {
        this.loadingFriends = false;
        this.toastService.createError(
          _('A problem occurred while finding friends'),
        );
      },
    );
  }

  loadMoreFriends() {
    this.page = this.page + 1;
    this.loadingFriendsMore = true;
    this.settingsService.findFriends(this.page).subscribe(
      friends => {
        this.loadingFriendsMore = false;

        if (friends.length > 0) {
          this.allFriendsLoaded = friends.length % 10 !== 0;
        } else {
          this.allFriendsLoaded = true;
        }
      },
      () => {
        this.loadingFriendsMore = false;
        this.allFriendsLoaded = true;
        this.toastService.createError(
          _('A problem occurred while finding friends'),
        );
      },
    );
  }

  async openDetails(user: UserDto) {
    const modal = await this.modalController.create({
      component: ProfileDetailsModalComponent,
      componentProps: {
        user,
        relation: this.relations.FRIEND,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }

  async openInvitation(invitation: FriendInvitation) {
    const modal = await this.modalController.create({
      component: FriendInvitationModalComponent,
      componentProps: {
        invitation,
      },
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.invitationId) {
      this.settingsService
        .respondFriendInvitation(data.invitationId, data.accept)
        .subscribe();
    }
  }
}
