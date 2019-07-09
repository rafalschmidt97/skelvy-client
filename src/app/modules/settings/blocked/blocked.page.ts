import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserDto } from '../../user/user';
import { Modal } from '../../../shared/modal/modal';
import { ModalService } from '../../../shared/modal/modal.service';
import { LoadingService } from '../../../core/loading/loading.service';
import { SettingsService } from '../settings.service';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class BlockedPage implements OnInit {
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  @Select(x => x.settings.blockedUsers) blockedUsers$: Observable<UserDto[]>;
  detailsModal: Modal;
  detailsUser: UserDto;
  loadingBlocked = true;
  loadingBlockedMore = false;
  allBlockedLoaded = false;
  page = 1;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly modalService: ModalService,
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

  openDetails(user: UserDto) {
    this.detailsUser = user;
    this.detailsModal = this.modalService.show(this.detailsTemplate, true);
  }

  confirmDetails() {
    this.detailsModal.hide();
  }
}
