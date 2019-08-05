import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, OnSubmit } from '../../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/form/input/input.component';
import { HttpErrorResponse } from '@angular/common/http';
import { _ } from '../../../../core/i18n/translate';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../../core/toast/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MeetingService } from '../../../meeting/meeting.service';
import { ChatService } from '../../chat.service';
import { MessageState, MessageType } from '../../../meeting/meeting';
import { Store } from '@ngxs/store';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { base64StringToBlob } from 'blob-util';
import { File } from '@ionic-native/file/ngx';
import { UploadService } from '../../../../core/upload/upload.service';
import { catchError, switchMap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import { PhotoDto } from '../../../../core/upload/upload';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { RemoveResponseChatMessage } from '../../../meeting/store/meeting-actions';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent implements Form, OnSubmit, OnInit {
  @ViewChild('messageInput') messageInput: ElementRef;
  form: FormGroup;
  isLoading = false;
  submitIcon = '👍';
  private readonly drinkTypes = [_('soft drinks'), _('alcoholic drinks')];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly storage: Storage,
    private readonly meetingService: MeetingService,
    private readonly chatService: ChatService,
    private readonly store: Store,
    private readonly camera: Camera,
    private readonly file: File,
    private readonly uploadService: UploadService,
    private readonly webview: WebView,
  ) {
    this.form = this.formBuilder.group({
      message: [
        '',
        [
          Validators.required,
          InputComponent.noWhitespaceValidation(),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  get hasErrorMaxLength(): boolean {
    return this.form.get('message').hasError('maxlength');
  }

  get hasErrorRequired(): boolean {
    return this.form.get('message').hasError('required');
  }

  ngOnInit() {
    const drinkType = this.store.selectSnapshot(
      state => state.meeting.meetingModel.meeting.drinkType.name,
    );

    if (drinkType === this.drinkTypes[1]) {
      this.submitIcon = '🍻';
    }
  }

  onSubmit() {
    this.messageInput.nativeElement.focus();

    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;

      this.sendTextMessage({
        id: 0,
        type: MessageType.RESPONSE,
        text: this.form.get('message').value.trim(),
        attachmentUrl: null,
        date: new Date().toISOString(),
        action: null,
        userId: this.store.selectSnapshot(state => state.user.user.id),
        groupId: this.store.selectSnapshot(
          state => state.meeting.meetingModel.meeting.groupId,
        ),
        sending: true,
      });

      this.form.patchValue({
        message: '',
      });

      this.isLoading = false;
    }
  }

  onSubmitIcon(icon: string) {
    if (!this.isLoading) {
      this.isLoading = true;

      this.sendTextMessage({
        id: 0,
        type: MessageType.RESPONSE,
        text: icon,
        attachmentUrl: null,
        date: new Date().toISOString(),
        action: null,
        userId: this.store.selectSnapshot(state => state.user.user.id),
        groupId: this.store.selectSnapshot(
          state => state.meeting.meetingModel.meeting.groupId,
        ),
        sending: true,
      });

      this.isLoading = false;
    }
  }

  async onSubmitTakeAndCrop() {
    if (!this.isLoading) {
      const takenPhotoUri = await this.takePhoto();

      if (takenPhotoUri) {
        this.isLoading = true;

        this.sendAttachmentMessage({
          id: 0,
          type: MessageType.RESPONSE,
          date: new Date().toISOString(),
          text: null,
          attachmentUrl: takenPhotoUri,
          action: null,
          userId: this.store.selectSnapshot(state => state.user.user.id),
          groupId: this.store.selectSnapshot(
            state => state.meeting.meetingModel.meeting.groupId,
          ),
          sending: true,
        });

        this.isLoading = false;
      }
    }
  }

  async onSubmitChooseAndCrop() {
    if (!this.isLoading) {
      const chosenPhotoUri = await this.choosePhoto();

      if (chosenPhotoUri) {
        this.isLoading = true;

        this.sendAttachmentMessage({
          id: 0,
          type: MessageType.RESPONSE,
          date: new Date().toISOString(),
          text: null,
          attachmentUrl: chosenPhotoUri,
          action: null,
          userId: this.store.selectSnapshot(state => state.user.user.id),
          groupId: this.store.selectSnapshot(
            state => state.meeting.meetingModel.meeting.groupId,
          ),
          sending: true,
        });

        this.isLoading = false;
      }
    }
  }

  private sendTextMessage(message: MessageState) {
    return from(this.chatService.addMessage(message))
      .pipe(
        switchMap(() => {
          return this.chatService.sendMessage(message);
        }),
      )
      .subscribe(
        () => {},
        (error: HttpErrorResponse) => {
          // data is not relevant (connection lost and reconnected)
          if (error.status === 404 || error.status === 409) {
            this.meetingService.findMeeting().subscribe();

            if (this.router.url === '/app/chat') {
              this.routerNavigation.navigateBack(['/app/tabs/meeting']);
            }

            this.toastService.createError(
              _('A problem occurred while sending the message'),
            );
          }
        },
      );
  }

  private sendAttachmentMessage(message: MessageState) {
    return from(
      this.chatService.addMessage({
        ...message,
        attachmentUrl: this.webview.convertFileSrc(message.attachmentUrl),
      }),
    )
      .pipe(
        switchMap(() => {
          return from(this.uploadPhoto(message));
        }),
        switchMap(photo => {
          return this.chatService.sendMessage({
            ...message,
            attachmentUrl: photo.url,
          });
        }),
      )
      .subscribe(
        () => {},
        (error: HttpErrorResponse) => {
          // data is not relevant (connection lost and reconnected)
          if (error.status === 404 || error.status === 409) {
            this.meetingService.findMeeting().subscribe();

            if (this.router.url === '/app/chat') {
              this.routerNavigation.navigateBack(['/app/tabs/meeting']);
            }

            this.toastService.createError(
              _('A problem occurred while sending the message'),
            );
          }
        },
      );
  }

  private async takePhoto(): Promise<string> {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      cameraDirection: this.camera.Direction.FRONT,
    };

    try {
      return await this.camera.getPicture(options);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async choosePhoto() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      cameraDirection: this.camera.Direction.FRONT,
    };

    try {
      return await this.camera.getPicture(options);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async uploadPhoto(message: MessageState): Promise<PhotoDto> {
    const data = new FormData();
    try {
      const photoUri = message.attachmentUrl;
      const fileName = photoUri.split('/').pop();
      const fileNameFixed = fileName.split('?')[0];
      const path = photoUri.replace(fileName, '');
      const fileData = await this.file.readAsDataURL(path, fileNameFixed);
      const croppedImage = await this.scaleImage(fileData, 1024, 1024);
      const blob = base64StringToBlob(
        croppedImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
        'image/jpeg',
      );
      data.append('file', blob, fileNameFixed);
    } catch (e) {
      console.error(e);
      this.toastService.createError(
        _('A problem occurred while uploading the photo'),
      );
    }

    return this.uploadService
      .upload(data)
      .pipe(
        catchError(err => {
          this.toastService.createError(
            _('A problem occurred while uploading the photo'),
          );

          this.store.dispatch(new RemoveResponseChatMessage(message));

          return throwError(err);
        }),
      )
      .toPromise();
  }

  private scaleImage(
    imageData: string,
    maxWidth: number,
    maxHeight: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageData;
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else if (width < height) {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        } else {
          width = maxWidth;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        const data = canvas.toDataURL('image/jpeg', 0.7);
        resolve(data);
      };
      image.onerror = () => {
        reject(new Error('Photo cropping failed'));
      };
    });
  }
}
