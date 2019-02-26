import { Component, OnInit } from '@angular/core';
import { MeetingModel } from '../meeting';
import { MeetingStoreService } from '../meeting-store.service';
import { Observable } from 'rxjs';
import { UserStoreService } from '../../profile/user-store.service';
import { User } from '../../profile/user';
import { MeetingService } from '../meeting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../core/toast/toast.service';
import { _ } from '../../../core/i18n/translate';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
})
export class OverviewPage implements OnInit {
  meeting$: Observable<MeetingModel>;
  user$: Observable<User>;
  isLoading = true;

  constructor(
    private readonly meetingStore: MeetingStoreService,
    private readonly meetingService: MeetingService,
    private readonly userStore: UserStoreService,
    private readonly toastService: ToastService,
  ) {
    this.meeting$ = meetingStore.data$;
    this.user$ = userStore.data$;
  }

  ngOnInit() {
    this.meetingService.getMeeting().subscribe(
      () => {
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          this.toastService.createError(_('Something went wrong'));
        }

        this.isLoading = false;
      },
    );
  }
}
