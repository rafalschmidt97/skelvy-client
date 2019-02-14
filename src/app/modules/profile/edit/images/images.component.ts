import {
  Component,
  forwardRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormComponent } from '../../../../shared/form/form.component';
import { ModalService } from '../../../../shared/modal/modal.service';
import { ComplexFieldComponent } from '../../../../shared/form/complex-field.component';
import { Modal } from '../../../../shared/modal/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { base64StringToBlob } from 'blob-util';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProfilePhoto } from '../../user';
import { get } from 'lodash';
import { UploadService } from '../../../../core/upload/upload.service';
import { ToastService } from '../../../../core/toast/toast.service';
import { _ } from '../../../../core/i18n/translate';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent extends ComplexFieldComponent implements OnInit {
  modal: Modal;
  inputForm: FormGroup;
  imageChangedEvent = '';
  croppedImage: string;
  croppedName: string;
  dirty = false;
  newImageName = 'image';
  image1Name = 'image1';
  image2Name = 'image2';
  image3Name = 'image3';
  @ViewChild('cropper') cropper: TemplateRef<any>;

  get isDirty(): boolean {
    return this.dirty;
  }

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly modalService: ModalService,
    private readonly formBuilder: FormBuilder,
    private readonly uploadService: UploadService,
    private readonly toastService: ToastService,
  ) {
    super(parent);
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
      const newValue: ProfilePhoto[] = [];
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

  fileChangeEvent(event: any, name: string) {
    const filesSelected = event.srcElement.files.length !== 0;
    if (filesSelected) {
      this.imageChangedEvent = event;
      this.croppedName = name;

      this.modal = this.modalService.show(this.cropper);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  confirm() {
    this.dirty = true;
    // TODO: loading

    const data = new FormData();
    const blob = base64StringToBlob(
      this.croppedImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
      'image/png',
    );
    data.append('file', blob, 'file.png');

    this.uploadService.upload(data).subscribe(
      photo => {
        this.inputForm.patchValue({
          [this.croppedName]: photo.url,
          [this.newImageName]: '',
        });

        this.modal.hide();
      },
      () => {
        this.toastService.createError(_('Something went wrong'));

        this.inputForm.patchValue({
          [this.croppedName]: '',
          [this.newImageName]: '',
        });

        this.modal.hide();
      },
    );
  }

  decline() {
    this.modal.hide();
  }

  remove(index: number) {
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
}
