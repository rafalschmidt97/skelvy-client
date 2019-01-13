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
  ) {
    super(parent);
  }

  ngOnInit() {
    const photos = this.form.get(this.name).value;

    this.inputForm = this.formBuilder.group({
      image: '',
      image1: photos[0],
      image2: photos[1] || '',
      image3: photos[2] || '',
    });

    this.inputForm.valueChanges.subscribe(items => {
      const newValue = [];
      if (items.image1 !== '') {
        newValue.push(items.image1);
      }
      if (items.image2 !== '') {
        newValue.push(items.image2);
      }
      if (items.image3 !== '') {
        newValue.push(items.image3);
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

    const data = new FormData();
    const blob = base64StringToBlob(
      this.croppedImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
      'image/png',
    );
    data.append('file', blob, 'file.png');

    // TODO: send to upload endpoint and attach value to form.get(name)

    console.log('To update:', this.croppedName, blob);
    this.modal.hide();
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
