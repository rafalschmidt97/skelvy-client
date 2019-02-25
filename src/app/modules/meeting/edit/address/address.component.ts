import {
  Component,
  forwardRef,
  Inject,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ComplexFieldComponent } from '../../../../shared/form/complex-field.component';
import { Modal } from '../../../../shared/modal/modal';
import { FormComponent } from '../../../../shared/form/form.component';
import { ModalService } from '../../../../shared/modal/modal.service';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MapsService } from '../../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { MapsResponse, MapsResponseType } from '../../../../core/maps/maps';
import { _ } from '../../../../core/i18n/translate';
import { ToastService } from '../../../../core/toast/toast.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent extends ComplexFieldComponent implements OnInit {
  @Input() range: boolean;
  @Input() placeholder = '';
  @Input() min: number;
  @Input() max: number;
  modal: Modal;
  search$ = new Subject<string>();
  results: MapsResponse[];
  resultLoading = false;
  resultSearched = false;
  loadingLocation = true;

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly modalService: ModalService,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly geolocation: Geolocation,
  ) {
    super(parent);

    this.search$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((text: string) => {
          if (text.trim().length > 0) {
            this.resultLoading = true;

            return this.mapsService.search(
              text,
              this.translateService.currentLang,
            );
          } else {
            return of(this.results);
          }
        }),
      )
      .subscribe(
        results => {
          this.resultSearched = true;
          this.results = results;
          this.resultLoading = false;
        },
        () => {
          this.toastService.createError(_('Something went wrong'));
        },
      );
  }

  ngOnInit() {
    this.geolocation
      .getCurrentPosition()
      .then(res => {
        this.mapsService
          .reverse(
            res.coords.latitude,
            res.coords.longitude,
            this.translateService.currentLang,
          )
          .subscribe(
            results => {
              if (results.length > 0) {
                this.select(results[0]);
              }

              this.loadingLocation = false;
            },
            () => {
              this.loadingLocation = false;
            },
          );
      })
      .catch(() => {
        this.loadingLocation = false;
      });
  }

  get dateLabel(): string {
    const value: MapsResponse = this.form.get(this.name).value;
    return value ? `${value.city}, ${value.country}` : this.placeholder;
  }

  open(template: TemplateRef<any>) {
    if (!this.isLoading && !this.loadingLocation) {
      this.modal = this.modalService.show(template);
    }
  }

  select(result: MapsResponse) {
    this.form.markAsDirty();
    this.form.markAsTouched();

    this.form.patchValue({
      [this.name]: result,
    });

    if (this.modal) {
      this.modal.hide();
    }
  }

  confirm() {
    this.modal.hide();
  }

  filterCities(response: MapsResponse[]): MapsResponse[] {
    return response.filter(x => x.type === MapsResponseType.LOCALITY);
  }

  filterVillages(response: MapsResponse[]): MapsResponse[] {
    return response.filter(x => x.type !== MapsResponseType.LOCALITY);
  }
}
