import { Component, OnInit } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { FriendInvitation, RelationType, UserDto } from '../../user/user';
import { SettingsService } from '../settings.service';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { FriendInvitationModalComponent } from './invitation-modal/friend-invitation-modal.component';
import { ProfileModalComponent } from '../../../shared/components/modal/profile/profile-modal.component';

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
  allFriendsLoaded = false;
  page = 1;
  relations = RelationType;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadFriends();
  }

  loadFriends() {
    this.loadingFriends = true;
    this.settingsService.findFriends(this.page).subscribe(
      friends => {
        this.loadingFriends = false;
        this.page = this.page + 1;

        if (friends.length > 0) {
          this.allFriendsLoaded = friends.length % 10 !== 0;
        } else {
          this.allFriendsLoaded = true;
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

  async openDetails(user: UserDto) {
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
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
