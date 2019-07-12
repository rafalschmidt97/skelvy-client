import {
  Component,
  forwardRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormComponent } from '../../../../shared/form/form.component';
import { ComplexFieldComponent } from '../../../../shared/form/complex-field.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { base64StringToBlob } from 'blob-util';
import { ProfilePhotoDto } from '../../user';
import { get } from 'lodash';
import { UploadService } from '../../../../core/upload/upload.service';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Modal } from '../../../../shared/modal/modal';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent extends ComplexFieldComponent implements OnInit {
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  @ViewChild('actions') modalTemplate: TemplateRef<any>;
  alert: Alert;
  modal: Modal;
  inputForm: FormGroup;
  dirty = false;
  image1Name = 'image1';
  image2Name = 'image2';
  image3Name = 'image3';
  loadingUpload = false;
  modalPhotoName: string;
  private removeIndex: number;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly uploadService: UploadService,
    private readonly alertService: AlertService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private readonly modalService: ModalService,
    private readonly camera: Camera,
    private readonly crop: Crop,
    private readonly file: File,
  ) {
    super(parent);
  }

  get isDirty(): boolean {
    return this.dirty;
  }

  ngOnInit() {
    const photos = this.form.get(this.name).value;

    this.inputForm = this.formBuilder.group({
      image: '',
      image1: get(photos, '[0].url'),
      image2: get(photos, '[1].url', ''),
      image3: get(photos, '[2].url', ''),
    });

    this.inputForm.valueChanges.subscribe(items => {
      const newValue: ProfilePhotoDto[] = [];
      if (items.image1 !== '') {
        newValue.push({ url: items.image1 });
      }
      if (items.image2 !== '') {
        newValue.push({ url: items.image2 });
      }
      if (items.image3 !== '') {
        newValue.push({ url: items.image3 });
      }

      this.form.patchValue({
        [this.name]: newValue,
      });
    });
  }

  showActions(name: string) {
    this.modalPhotoName = name;
    this.modal = this.modalService.show(this.modalTemplate);
  }

  async takeAndCrop() {
    if (!this.loadingUpload) {
      this.modal.hide();
      const takenPhotoUri = await this.takePhoto();

      if (takenPhotoUri) {
        const croppedPhotoUri = await this.cropPhoto(takenPhotoUri);

        if (croppedPhotoUri) {
          this.dirty = true;
          await this.uploadPhoto(croppedPhotoUri, this.modalPhotoName);
        }
      }
    }
  }

  async chooseAndCrop() {
    if (!this.loadingUpload) {
      this.modal.hide();
      const chosenPhotoUri = await this.choosePhoto();

      if (chosenPhotoUri) {
        const croppedPhotoUri = await this.cropPhoto(chosenPhotoUri);

        if (croppedPhotoUri) {
          this.dirty = true;
          await this.uploadPhoto(croppedPhotoUri, this.modalPhotoName);
        }
      }
    }
  }

  decline() {
    this.modal.hide();
  }

  remove(index: number) {
    this.removeIndex = index;
    this.alert = this.alertService.show(this.alertTemplate);
  }

  confirmAlert() {
    this.removeFromInput(this.removeIndex);
    this.alert.hide();
  }

  declineAlert() {
    this.alert.hide();
  }

  private removeFromInput(index: number) {
    this.dirty = true;

    if (index === 1) {
      this.inputForm.patchValue({
        [this.image1Name]: this.inputForm.get(this.image2Name).value,
        [this.image2Name]: this.inputForm.get(this.image3Name).value,
        [this.image3Name]: '',
      });
    } else if (index === 2) {
      this.inputForm.patchValue({
        [this.image2Name]: this.inputForm.get(this.image3Name).value,
        [this.image3Name]: '',
      });
    } else {
      this.inputForm.patchValue({
        [this.image3Name]: '',
      });
    }
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

  private async cropPhoto(photo: string) {
    try {
      return await this.crop.crop(photo, {
        quality: 100,
        targetWidth: 1024,
        targetHeight: 1024,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async uploadPhoto(photoUri: string, name: string) {
    this.loadingUpload = true;
    const fileName = photoUri.split('/').pop();
    const path = photoUri.replace(fileName, '');
    const fileData = await this.file.readAsDataURL(path, fileName);
    const croppedImage = await this.cropImage(fileData, 1024, 1024);
    const data = new FormData();
    const blob = base64StringToBlob(
      croppedImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
      'image/jpeg',
    );
    data.append('file', blob, fileName);

    this.uploadService.upload(data).subscribe(
      photo => {
        this.inputForm.patchValue({
          [name]: photo.url,
        });

        this.loadingUpload = false;
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while uploading the photo'),
        );

        this.inputForm.patchValue({
          [name]: '',
        });

        this.loadingUpload = false;
      },
    );
  }

  private cropImage(
    imageData: string,
    width: number,
    height: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageData;
      image.crossOrigin = 'Anonymous';
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      image.onload = () => {
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
