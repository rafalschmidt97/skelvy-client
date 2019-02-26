import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Meeting, MeetingUser } from '../../meeting';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Profile, User } from '../../../profile/user';
import { Modal } from '../../../../shared/modal/modal';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { MapsService } from '../../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/toast/toast.service';
import { MapsResponse } from '../../../../core/maps/maps';
import { _ } from '../../../../core/i18n/translate';

@Component({
  selector: 'app-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.scss'],
})
export class FoundComponent implements OnInit {
  @Input() meeting: Meeting;
  @Input() user: User;
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  profileForModal: Profile;
  modal: Modal;
  alert: Alert;
  loadingLocation = true;
  location: MapsResponse;

  constructor(
    private readonly modalService: ModalService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
  ) {}

  get filteredMeetingUsers(): MeetingUser[] {
    return this.meeting.users.filter(user => user.id !== this.user.id);
  }

  ngOnInit() {
    this.mapsService
      .reverse(
        this.meeting.latitude,
        this.meeting.longitude,
        this.translateService.currentLang,
      )
      .subscribe(
        results => {
          if (results.length > 0) {
            this.location = results[0];
          }

          this.loadingLocation = false;
        },
        () => {
          this.loadingLocation = false;
          this.toastService.createError(_('Something went wrong'));
        },
      );

    this.route.queryParams.pipe(debounceTime(100)).subscribe(params => {
      const userId = Number(params.userId);
      const meetingUser = this.meeting.users.find(user => user.id === userId);
      if (meetingUser) {
        this.openDetails(meetingUser);
      }
    });
  }

  openDetails(user: MeetingUser) {
    this.profileForModal = user.profile;
    this.modal = this.modalService.show(this.detailsTemplate);
  }

  leaveGroup() {
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmDetails() {
    this.modal.hide();
  }

  confirmAlert() {
    this.alert.hide();
    // TODO: use service to leave meeting
  }

  declineAlert() {
    this.alert.hide();
  }
}
