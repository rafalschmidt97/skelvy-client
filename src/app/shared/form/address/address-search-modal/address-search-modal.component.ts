import { Component, Input } from '@angular/core';
import { MapsResponse, MapsResponseType } from '../../../../core/maps/maps';
import { _ } from '../../../../core/i18n/translate';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ToastService } from '../../../../core/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MapsService } from '../../../../core/maps/maps.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-address-search-modal',
  templateUrl: './address-search-modal.component.html',
})
export class AddressSearchModalComponent {
  @Input() results: MapsResponse[];
  @Input() lastSearch: string;
  @Input() placeholder: string;
  search$ = new Subject<string>();
  resultSearched = false;
  resultLoading = false;
  search = '';

  constructor(
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly mapsService: MapsService,
    private readonly modalController: ModalController,
  ) {
    this.search$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((text: string) => {
          return this.searchLocation(text);
        }),
      )
      .subscribe(
        results => {
          this.resultSearched = true;
          this.results = results;
          this.resultLoading = false;
        },
        () => {
          this.toastService.createError(
            _('A problem occurred while searching for locations'),
          );
        },
      );
  }

  filterCities(response: MapsResponse[]): MapsResponse[] {
    return response.filter(x => x.type === MapsResponseType.LOCALITY);
  }

  filterVillages(response: MapsResponse[]): MapsResponse[] {
    return response.filter(x => x.type !== MapsResponseType.LOCALITY);
  }

  select(result: MapsResponse) {
    this.modalController.dismiss({
      result,
      results: this.results,
      lastSearch: this.lastSearch,
    });
  }

  private searchLocation(text: string) {
    this.lastSearch = text;
    if (text.trim().length > 0) {
      this.resultLoading = true;

      return this.mapsService.search(text, this.translateService.currentLang);
    } else {
      return of(this.results);
    }
  }

  confirm() {
    this.modalController.dismiss();
  }
}
