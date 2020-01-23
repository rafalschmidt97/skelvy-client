import { Component, Input, OnInit } from '@angular/core';
import { RelationDto, RelationType } from '../../../../modules/user/user';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ToastService } from '../../../../core/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '../../../../core/i18n/translate';
import { ModalController } from '@ionic/angular';
import {
  GroupState,
  GroupUserDto,
  GroupUserRole,
  MeetingDto,
} from '../../../../modules/meetings/meetings';
import { MeetingsService } from '../../../../modules/meetings/meetings.service';
import { UserService } from '../../../../modules/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-group-profile-details-modal',
  templateUrl: './group-profile-modal.component.html',
  styleUrls: ['./group-profile-modal.component.scss'],
})
export class GroupProfileModalComponent implements OnInit {
  @Input() openingUser: GroupUserDto;
  @Input() user: GroupUserDto;
  @Input() meeting: MeetingDto;
  @Input() group: GroupState;
  relation: RelationDto = null;
  loadingRelation = true;
  loadingRemoved = false;
  loadingRole = false;
  loadingFriend = false;
  loadingBlocked = false;
  relations = RelationType;
  roles = GroupUserRole;
  private readonly relationsTypes = [_('friend'), _('blocked'), _('pending')];

  constructor(
    private readonly emailComposer: EmailComposer,
    private readonly toastService: ToastService,
    private readonly userService: UserService,
    private readonly translateService: TranslateService,
    private readonly modalController: ModalController,
    private readonly meetingsService: MeetingsService,
  ) {}

  ngOnInit() {
    this.getRelation();
  }

  getRelation() {
    this.loadingRelation = true;
    this.userService.checkRelation(this.user.id).subscribe(
      relation => {
        this.relation = relation;
        this.loadingRelation = false;
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.loadingRelation = false;
        } else {
          this.toastService.createError(
            _('A problem occurred while finding the relation'),
          );

          this.modalController.dismiss();
        }
      },
    );
  }

  makeAdmin() {
    this.loadingRole = true;
    this.meetingsService
      .updateMeetingUserRole(
        this.meeting.id,
        this.group.id,
        this.user.id,
        GroupUserRole.ADMIN,
      )
      .subscribe(
        () => {
          this.loadingRole = false;
          this.modalController.dismiss();
        },
        () => {
          this.loadingRole = false;
        },
      );
  }

  makePrivileged() {
    this.loadingRole = true;
    this.meetingsService
      .updateMeetingUserRole(
        this.meeting.id,
        this.group.id,
        this.user.id,
        GroupUserRole.PRIVILEGED,
      )
      .subscribe(
        () => {
          this.loadingRole = false;
          this.modalController.dismiss();
        },
        () => {
          this.loadingRole = false;
        },
      );
  }

  removePrivileges() {
    this.loadingRole = true;
    this.meetingsService
      .updateMeetingUserRole(
        this.meeting.id,
        this.group.id,
        this.user.id,
        GroupUserRole.MEMBER,
      )
      .subscribe(
        () => {
          this.loadingRole = false;
          this.modalController.dismiss();
        },
        () => {
          this.loadingRole = false;
        },
      );
  }

  blockUser() {
    this.loadingBlocked = true;
    this.userService.addBlockedUser(this.user).subscribe(
      () => {
        this.setRelationType(RelationType.BLOCKED);
        this.loadingBlocked = false;
      },
      () => {
        this.getRelation();
        this.loadingBlocked = false;
      },
    );
  }

  removeBlockUser() {
    this.loadingBlocked = true;
    this.userService.removeBlockedUser(this.user.id).subscribe(
      () => {
        this.relation = null;
        this.loadingBlocked = false;
      },
      () => {
        this.getRelation();
        this.loadingBlocked = false;
      },
    );
  }

  inviteFriend() {
    this.loadingFriend = true;
    this.userService.inviteFriend(this.user.id).subscribe(
      () => {
        this.setRelationType(RelationType.PENDING);
        this.loadingFriend = false;
      },
      () => {
        this.getRelation();
        this.loadingFriend = false;
      },
    );
  }

  removeFriend() {
    this.loadingFriend = true;
    this.userService.removeFriend(this.user.id).subscribe(
      () => {
        this.relation = null;
        this.loadingFriend = false;
      },
      () => {
        this.getRelation();
        this.loadingFriend = false;
      },
    );
  }

  removeFromGroup() {
    this.loadingRemoved = true;
    this.meetingsService
      .removeFromGroup(this.user.id, this.meeting.id, this.group.id)
      .subscribe(
        () => {
          this.modalController.dismiss();
        },
        () => {
          this.getRelation();
          this.loadingRemoved = false;
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
        );
      });
  }

  confirm() {
    this.modalController.dismiss();
  }

  private setRelationType(relation: RelationType) {
    if (this.relation == null) {
      this.relation = {
        userId: this.openingUser.id,
        relatedUserId: this.user.id,
        type: relation,
      };
    } else {
      this.relation.type = relation;
    }
  }
}
