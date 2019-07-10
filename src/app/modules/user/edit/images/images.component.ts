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
import { LoadingService } from '../../../../core/loading/loading.service';
import { Alert } from '../../../../shared/alert/alert';
import { AlertService } from '../../../../shared/alert/alert.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent extends ComplexFieldComponent implements OnInit {
  @ViewChild('alert') alertTemplate: TemplateRef<any>;
  alert: Alert;
  inputForm: FormGroup;
  dirty = false;
  image1Name = 'image1';
  image2Name = 'image2';
  image3Name = 'image3';
  loadingUpload = false;
  private removeIndex: number;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly uploadService: UploadService,
    private readonly alertService: AlertService,
    private readonly loadingService: LoadingService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
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

  selectAndCrop(name: string) {
    this.loadingUpload = true;
    this.loadingService.lock();
    this.dirty = true;

    const croppedBase64 = ''; // TODO: get data

    const data = new FormData();
    const blob = base64StringToBlob(
      croppedBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
      'image/png',
    );
    data.append('file', blob, 'file.png');

    this.uploadService.upload(data).subscribe(
      photo => {
        this.inputForm.patchValue({
          [this.name]: photo.url,
        });

        this.loadingUpload = false;
        this.loadingService.unlock();
      },
      () => {
        this.toastService.createError(
          _('A problem occurred while uploading the photo'),
        );

        this.inputForm.patchValue({
          [this.name]: '',
        });

        this.loadingUpload = false;
        this.loadingService.unlock();
      },
    );
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
}
