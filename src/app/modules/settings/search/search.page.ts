import { Component } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserWithRoleDto } from '../../user/user';
import { ModalController } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProfileModalComponent } from '../../../shared/components/modal/profile/profile-modal.component';
import { UserService } from '../../user/user.service';
import { Store } from '@ngxs/store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['../overview/overview.page.scss'],
})
export class SearchPage {
  search$ = new Subject<string>();
  results: UserWithRoleDto[];
  resultSearched = false;
  resultLoading = false;
  search = '';

  constructor(
    private readonly userService: UserService,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
    private readonly store: Store,
  ) {
    this.search$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((text: string) => {
          return this.searchUsers(text);
        }),
      )
      .subscribe(
        results => {
          this.resultSearched = true;
          this.results = results;
          this.resultLoading = false;
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while searching for users'),
          );
        },
      );
  }

  private searchUsers(username: string) {
    if (username.trim().length >= 3) {
      this.resultLoading = true;

      return this.userService.findUsers(username.trim().toLowerCase());
    } else {
      return of(this.results);
    }
  }

  async openDetails(user: UserWithRoleDto) {
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
      componentProps: {
        user: { id: user.id, profile: user.profile, name: user.name },
        openingUser: this.store.selectSnapshot(state => state.user.user),
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }
}
