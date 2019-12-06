import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { GroupState } from '../../meetings/meetings';
import { SelfUserDto } from '../../user/user';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  group: GroupState;
  user: SelfUserDto;
  group$: Subscription;
  isLoading: boolean;

  constructor(
    private readonly routerNavigation: NavController,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const groupId = +this.route.snapshot.paramMap.get('id');

    if (!groupId) {
      this.routerNavigation.navigateBack(['/app/tabs/meetings']);
    }

    this.group$ = combineLatest([
      this.store.select(state => state.meetings),
      this.store.select(state => state.user),
    ])
      .pipe(
        map(([meetingState, userState]) => {
          const group = meetingState.groups.find(x => x.id === groupId);

          if (!group) {
            this.routerNavigation.navigateBack(['/app/tabs/meetings']);
          }

          return {
            isLoading: meetingState.loading,
            group,
            user: userState.user,
          };
        }),
        tap(({ isLoading, group, user }) => {
          this.isLoading = isLoading;
          this.group = group;
          this.user = user;
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.group$) {
      this.group$.unsubscribe();
    }
  }
}
