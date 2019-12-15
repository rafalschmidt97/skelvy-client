import { Component } from '@angular/core';
import { _ } from '../../../core/i18n/translate';
import { ToastService } from '../../../core/toast/toast.service';
import { UserWithRoleDto } from '../../user/user';
import { SettingsService } from '../settings.service';
import { ProfileDetailsModalComponent } from '../../../shared/components/profile-details-modal/profile-details-modal.component';
import { ModalController } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
    private readonly settingsService: SettingsService,
    private readonly modalController: ModalController,
    private readonly toastService: ToastService,
  ) {
    this.search$
      .pipe(
        debounceTime(1500),
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

  onSubmit() {
    if (this.search.toLowerCase()) {
      this.searchUsers(this.search).subscribe(
        results => {
          this.resultSearched = true;
          this.results = results;
          this.resultLoading = false;
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while searching for locations'),
          );
        },
      );
    }
  }

  private searchUsers(username: string) {
    if (username.trim().length > 0) {
      this.resultLoading = true;

      return this.settingsService.findUsers(username);
    } else {
      return of(this.results);
    }
  }

  async openDetails(user: UserWithRoleDto) {
    const modal = await this.modalController.create({
      component: ProfileDetailsModalComponent,
      componentProps: {
        user: { id: user.id, profile: user.profile, name: user.name },
        relation: user.relationType,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }
}
