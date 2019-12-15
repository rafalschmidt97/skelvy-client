import { Component, Input } from '@angular/core';
import { RelationType } from '../../../../modules/user/user';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ToastService } from '../../../../core/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../../modules/settings/settings.service';
import { _ } from '../../../../core/i18n/translate';
import { ModalController } from '@ionic/angular';
import { GroupUserDto } from '../../../../modules/meetings/meetings';

@Component({
  selector: 'app-group-profile-details-modal',
  templateUrl: './group-profile-modal.component.html',
  styleUrls: ['./group-profile-modal.component.scss'],
})
export class GroupProfileModalComponent {
  @Input() user: GroupUserDto;
  @Input() relation: RelationType;
  loadingFriend = false;
  loadingBlocked = false;
  relations = RelationType;
  private readonly relationsTypes = [_('friend'), _('blocked'), _('pending')];

  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
    private readonly settingsService: SettingsService,
    private readonly translateService: TranslateService,
    private readonly modalController: ModalController,
  ) {}

  blockUser() {
    this.loadingBlocked = true;
    this.settingsService.addBlockedUser(this.user).subscribe(
      () => {
        this.relation = RelationType.BLOCKED;
        this.loadingBlocked = false;
      },
      () => {
        this.loadingBlocked = false;
      },
    );
  }

  removeBlockUser() {
    this.loadingBlocked = true;
    this.settingsService.removeBlockedUser(this.user.id).subscribe(
      () => {
        this.relation = null;
        this.loadingBlocked = false;
      },
      () => {
        this.loadingBlocked = false;
      },
    );
  }

  inviteFriend() {
    this.loadingFriend = true;
    this.settingsService.inviteFriend(this.user.id).subscribe(
      () => {
        this.relation = RelationType.PENDING;
        this.loadingFriend = false;
      },
      () => {
        this.loadingFriend = false;
      },
    );
  }

  removeFriend() {
    this.loadingFriend = true;
    this.settingsService.removeFriend(this.user.id).subscribe(
      () => {
        this.relation = null;
        this.loadingFriend = false;
      },
      () => {
        this.loadingFriend = false;
      },
    );
  }

  async sendReport() {
    const subject = await this.translateService
      .get(_('Report user'))
      .toPromise();

    this.emailComposer
      .open({
        to: 'contact.skelvy@gmail.com',
        subject: `[Skelvy] ${subject}#${this.user.id}`,
      })
      .then(() => {
        this.toastService.createInformation(
          _(
            `If you have any further problems, don't hesitate to contact us by using our website`,
          ),
          10000,
        );
      });
  }

  confirm() {
    this.modalController.dismiss();
  }
}
