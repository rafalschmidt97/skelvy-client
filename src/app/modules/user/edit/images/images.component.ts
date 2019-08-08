import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormComponent } from '../../../../shared/form/form.component';
import { ComplexFieldComponent } from '../../../../shared/form/complex-field.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { base64StringToBlob } from 'blob-util';
import { ProfilePhotoDto } from '../../user';
import { get } from 'lodash';
import { UploadService } from '../../../../core/upload/upload.service';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImageActionsModalComponent } from './image-actions-modal/image-actions-modal.component';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertModalComponent } from '../../../../shared/components/alert/alert-modal/alert-modal.component';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent extends ComplexFieldComponent implements OnInit {
  inputForm: FormGroup;
  dirty = false;
  image1Name = 'image1';
  image2Name = 'image2';
  image3Name = 'image3';
  loadingUpload = false;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly uploadService: UploadService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private readonly modalController: ModalController,
    private readonly camera: Camera,
    private readonly crop: Crop,
    private readonly file: File,
    private readonly translateService: TranslateService,
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
      image1: get(photos, '[0].url', ''),
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

  async showActions(name: string) {
    const modal = await this.modalController.create({
      component: ImageActionsModalComponent,
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) {
      if (data.take) {
        await this.takeAndCrop(name);
      } else if (data.choose) {
        await this.chooseAndCrop(name);
      }
    }
  }

  async takeAndCrop(name: string) {
    if (!this.loadingUpload) {
      const takenPhotoUri = await this.takePhoto();

      if (takenPhotoUri) {
        const croppedPhotoUri = await this.cropPhoto(takenPhotoUri);

        if (croppedPhotoUri) {
          this.dirty = true;
          await this.uploadPhoto(croppedPhotoUri, name);
        }
      }
    }
  }

  async chooseAndCrop(name: string) {
    if (!this.loadingUpload) {
      const chosenPhotoUri = await this.choosePhoto();

      if (chosenPhotoUri) {
        const croppedPhotoUri = await this.cropPhoto(chosenPhotoUri);

        if (croppedPhotoUri) {
          this.dirty = true;
          await this.uploadPhoto(croppedPhotoUri, name);
        }
      }
    }
  }

  async remove(index: number) {
    const modal = await this.modalController.create({
      component: AlertModalComponent,
      componentProps: {
        title: this.translateService.instant('Are you sure?'),
      },
      cssClass: 'ionic-modal ionic-action-modal',
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data && data.response) {
      this.removeFromInput(index);
    }
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
      return null;
    }
  }

  private async uploadPhoto(photoUri: string, name: string) {
    this.loadingUpload = true;
    const data = new FormData();
    try {
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
      this.loadingUpload = false;
    }

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

  private scaleImage(
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
