import { Component } from '@angular/core';
import { SelfUserDto } from '../user';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { ProfileModalComponent } from '../../../shared/components/modal/profile/profile-modal.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage {
  @Select(state => state.user.user) user$: Observable<SelfUserDto>;

  constructor(
    private readonly modalController: ModalController,
    private readonly store: Store,
  ) {}

  async openDetails() {
    const user: SelfUserDto = this.store.selectSnapshot(
      state => state.user.user,
    );

    const detailsUser = {
      ...user,
      profile: {
        ...user.profile,
        age: moment().diff(moment(user.profile.birthday), 'years'),
      },
    };

    const modal = await this.modalController.create({
      component: ProfileModalComponent,
      componentProps: {
        user: detailsUser,
        mine: true,
      },
      cssClass: 'ionic-modal ionic-full-modal',
    });

    await modal.present();
  }
}
