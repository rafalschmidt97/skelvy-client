import { Component, forwardRef, Inject, Input, OnInit } from '@angular/core';
import { ComplexFieldComponent } from '../../../../shared/form/complex-field.component';
import { FormComponent } from '../../../../shared/form/form.component';
import { MapsService } from '../../../../core/maps/maps.service';
import { TranslateService } from '@ngx-translate/core';
import { MapsResponse } from '../../../../core/maps/maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { isNil } from 'lodash';
import { AddressSearchModalComponent } from './address-search-modal/address-search-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent extends ComplexFieldComponent implements OnInit {
  @Input() placeholder = '';
  results: MapsResponse[];
  loadingLocation = false;
  lastSearch = '';

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly modalController: ModalController,
    private readonly mapsService: MapsService,
    private readonly translateService: TranslateService,
    private readonly geolocation: Geolocation,
  ) {
    super(parent);
  }

  get dateLabel(): string {
    const value: MapsResponse = this.form.get(this.name).value;
    return value ? `${value.city}, ${value.country}` : this.placeholder;
  }

  ngOnInit() {
    if (isNil(this.form.get(this.name).value)) {
      this.findCurrentLocation();
    }
  }

  findCurrentLocation() {
    if (!this.isLoading && !this.loadingLocation) {
      this.loadingLocation = true;
      this.geolocation
        .getCurrentPosition({
          timeout: 5000,
          maximumAge: 10000,
          enableHighAccuracy: false,
        })
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
  }

  async open() {
    if (!this.isLoading && !this.loadingLocation) {
      const modal = await this.modalController.create({
        component: AddressSearchModalComponent,
        componentProps: {
          results: this.results,
          lastSearch: this.lastSearch,
          placeholder: this.placeholder,
        },
        cssClass: 'ionic-modal ionic-full-modal',
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();

      if (data) {
        this.results = data.results;
        this.lastSearch = data.lastSearch;
        this.select(data.result);
      }
    }
  }

  select(result: MapsResponse) {
    this.form.markAsDirty();
    this.form.markAsTouched();

    this.form.patchValue({
      [this.name]: result,
    });
  }
}
