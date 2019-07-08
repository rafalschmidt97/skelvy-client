import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserDto } from '../../user/user';
import { Modal } from '../../../shared/modal/modal';
import { Alert } from '../../../shared/alert/alert';
import { ModalService } from '../../../shared/modal/modal.service';
import { AlertService } from '../../../shared/alert/alert.service';
import { LoadingService } from '../../../core/loading/loading.service';
import { SettingsState } from '../store/settings-state';
import { SettingsService } from '../settings.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class BlockedPage implements OnInit {
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  blockedUsers$: Observable<UserDto[]>;
  userForModal: UserDto;
  modal: Modal;
  alert: Alert;
  loadingBlocked = true;
  loadingBlockedMore = false;
  allBlockedLoaded = false;
  loadingRemove = false;
  page = 1;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly settingsState: SettingsState,
    private readonly modalService: ModalService,
    private readonly alertService: AlertService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
  ) {
    this.blockedUsers$ = settingsState.data$.pipe(map(x => x.blockedUsers));
  }

  ngOnInit() {
    if (!this.settingsState.data || !this.settingsState.data.blockedUsers) {
      this.loadBlockedUsers();
    } else {
      this.loadingBlocked = false;
      const blockedUsersAmount = this.settingsState.data.blockedUsers.length;
      this.page =
        blockedUsersAmount % 10 !== 0
          ? blockedUsersAmount / 10 + 1
          : blockedUsersAmount / 10;
      this.allBlockedLoaded =
        this.settingsState.data.blockedUsers.length % 10 !== 0;
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
    this.userForModal = user;
    this.modal = this.modalService.show(this.detailsTemplate, true);
  }

  removeBlockedUser() {
    this.modal.hide();
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmDetails() {
    this.modal.hide();
  }

  confirmAlert() {
    this.loadingRemove = true;
    this.loadingService.lock();
    this.settingsService.removeBlockedUser(this.userForModal.id).subscribe(
      () => {
        this.alert.hide();
        this.loadingService.unlock();
        this.loadingRemove = false;
      },
      () => {
        this.alert.hide();
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while removing blocked user'),
        );
        this.loadingRemove = false;
      },
    );
  }

  declineAlert() {
    this.alert.hide();
  }
}
