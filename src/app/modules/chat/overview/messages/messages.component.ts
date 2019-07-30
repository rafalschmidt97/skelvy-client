import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageDto, MessageState, MeetingDto } from '../../../meeting/meeting';
import { UserDto } from '../../../user/user';
import { _ } from '../../../../core/i18n/translate';
import { ChatService } from '../../chat.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../../../../core/toast/toast.service';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MeetingService } from '../../../meeting/meeting.service';
import { Store } from '@ngxs/store';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { MessageActionModalComponent } from './message-action-modal/message-action-modal.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  @Input() messages: MessageState[];
  @Input() meeting: MeetingDto;
  @Input() user: UserDto;
  dateToShow: string;
  isLoading = false;
  hasMoreMessages = false;

  constructor(
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly modalController: ModalController,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    if (
      this.store.selectSnapshot(state => state.meeting.meetingModel.messages)
        .length >= 20
    ) {
      this.hasMoreMessages = true;
    }

    this.scrollToLastMessage();
  }

  findUser(userId: number): UserDto {
    return this.meeting.users.find(user => user.id === userId);
  }

  showDate(date) {
    if (this.dateToShow === date) {
      this.dateToShow = null; // toggle if same date passed
    } else {
      this.dateToShow = date;
    }
  }

  loadMessages() {
    if (this.hasMoreMessages && !this.isLoading) {
      this.isLoading = true;
      this.chatService.findMoreMessages().subscribe(
        (messages: MessageDto[]) => {
          if (messages.length < 20) {
            this.hasMoreMessages = false;
          }

          this.isLoading = false;
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while loading messages'),
          );

          this.isLoading = false;
        },
      );
    }
  }

  async showActions(message: MessageState) {
    const modal = await this.modalController.create({
      component: MessageActionModalComponent,
      componentProps: {
        message,
      },
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
  }

  async showPreview(src: string) {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        src,
      },
    });

    await modal.present();
  }

  private scrollToLastMessage() {
    setTimeout(() => {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }, 200);
  }
}
