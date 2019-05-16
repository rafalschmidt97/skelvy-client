import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MeetingDto, MeetingUserDto } from '../../meeting';
import { ModalService } from '../../../../shared/modal/modal.service';
import { UserDto } from '../../../user/user';
import { Modal } from '../../../../shared/modal/modal';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';
import { MapsService } from '../../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/toast/toast.service';
import { MapsResponse } from '../../../../core/maps/maps';
import { _ } from '../../../../core/i18n/translate';
import { LoadingService } from '../../../../core/loading/loading.service';
import { MeetingService } from '../../meeting.service';
import { ChatStoreService } from '../../../chat/chat-store.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.scss'],
})
export class FoundComponent implements OnInit {
  @Input() meeting: MeetingDto;
  @Input() user: UserDto;
  @ViewChild('details') detailsTemplate: TemplateRef<any>;
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  userForModal: MeetingUserDto;
  modal: Modal;
  alert: Alert;
  loadingLocation = true;
  location: MapsResponse;
  loadingLeave = false;
  messagesToRead = 0;

  constructor(
    private readonly modalService: ModalService,
    private readonly alertService: AlertService,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly loadingService: LoadingService,
    private readonly meetingService: MeetingService,
    private readonly chatStore: ChatStoreService,
    private readonly routerNavigation: NavController,
    private readonly storage: Storage,
  ) {}

  get filteredMeetingUsers(): MeetingUserDto[] {
    return this.meeting.users.filter(user => user.id !== this.user.id);
  }

  get missingMeetingUsers(): any[] {
    const amount = this.meeting.users.length;
    const missingAmount = 4 - amount; // 4 is max size of group
    const data = [];

    for (let i = 0; i < missingAmount; i++) {
      data.push(i);
    }

    return data;
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
          this.toastService.createError(
            _('A problem occurred while searching for the location'),
          );
        },
      );

    this.chatStore.data$.subscribe(chat => {
      if (chat && chat.messages) {
        this.messagesToRead = chat.messagesToRead;
      } else {
        this.messagesToRead = 0;
      }
    });
  }

  openDetails(user: MeetingUserDto) {
    this.userForModal = user;
    this.modal = this.modalService.show(this.detailsTemplate, true);
  }

  leaveGroup() {
    this.loadingLeave = false;
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmDetails() {
    this.modal.hide();
  }

  confirmAlert() {
    this.loadingLeave = true;
    this.loadingService.lock();
    this.meetingService.leaveMeeting().subscribe(
      () => {
        this.alert.hide();
        this.loadingService.unlock();
      },
      (error: HttpErrorResponse) => {
        // data is not relevant (connection lost and reconnected)
        if (error.status === 404) {
          this.meetingService.findMeeting().subscribe();
        }

        this.alert.hide();
        this.loadingService.unlock();
        this.toastService.createError(
          _('A problem occurred while leaving the meeting'),
        );
      },
    );
  }

  declineAlert() {
    this.alert.hide();
  }

  showMessages() {
    this.routerNavigation.navigateForward(['/app/chat']).then(() => {
      setTimeout(() => {
        this.chatStore.setToRead(0);
        const messages = this.chatStore.data.messages;
        if (messages.length > 0) {
          this.storage.set(
            'lastMessageDate',
            messages[messages.length - 1].date,
          );
        }
      }, 1000);
    });
  }
}
