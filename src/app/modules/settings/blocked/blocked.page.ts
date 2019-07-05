import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../../user/user.service';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserDto } from '../../user/user';
import { Modal } from '../../../shared/modal/modal';
import { Alert } from '../../../shared/alert/alert';
import { ModalService } from '../../../shared/modal/modal.service';
import { AlertService } from '../../../shared/alert/alert.service';
import { LoadingService } from '../../../core/loading/loading.service';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class BlockedPage implements OnInit {
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  blockedUsers: UserDto[];
  userForModal: UserDto;
  modal: Modal;
  alert: Alert;
  loadingBlocked = true;
  loadingBlockedMore = false;
  allBlockedLoaded = false;
  loadingRemove = false;
  page = 1;

  constructor(
    private readonly usersService: UserService,
    private readonly modalService: ModalService,
    private readonly alertService: AlertService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
  ) {}

  get showLoadMore() {
    return this.blockedUsers.length > 0 && !this.allBlockedLoaded;
  }

  ngOnInit() {
    this.loadBlockedUsers();
  }

  loadBlockedUsers() {
    this.loadingBlocked = true;
    this.usersService.getBlockedUsers().subscribe(
      results => {
        this.blockedUsers = results;
        this.loadingBlocked = false;

        this.allBlockedLoaded = this.blockedUsers.length % 10 !== 0;
      },
      () => {
        this.blockedUsers = [];
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
    this.usersService.getBlockedUsers(this.page).subscribe(
      results => {
        this.blockedUsers = [...this.blockedUsers, ...results];
        this.loadingBlockedMore = false;
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
    this.loadingRemove = false;
    this.modal.hide();
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmDetails() {
    this.modal.hide();
  }

  confirmAlert() {
    this.loadingRemove = true;
    this.loadingService.lock();
    this.usersService.removeBlockedUser(this.userForModal.id).subscribe(
      () => {
        this.blockedUsers = this.blockedUsers.filter(
          user => user.id !== this.userForModal.id,
        );

        this.alert.hide();
        this.loadingService.unlock();
      },
      () => {
        this.alert.hide();
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while removing blocked user'),
        );
      },
    );
  }

  declineAlert() {
    this.alert.hide();
  }
}
