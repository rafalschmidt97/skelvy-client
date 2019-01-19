import {
  Component,
  forwardRef,
  Inject,
  Input,
  TemplateRef,
} from '@angular/core';
import { ComplexFieldComponent } from '../../../../shared/form/complex-field.component';
import { Modal } from '../../../../shared/modal/modal';
import { FormComponent } from '../../../../shared/form/form.component';
import { ModalService } from '../../../../shared/modal/modal.service';
import { of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent extends ComplexFieldComponent {
  @Input() range: boolean;
  @Input() placeholder = '';
  @Input() min: number;
  @Input() max: number;
  modal: Modal;
  search$ = new Subject<string>();
  results: Object;
  baseUrl = 'https://api.cdnjs.com/libraries';
  queryUrl = '?search=';

  constructor(
    @Inject(forwardRef(() => FormComponent)) readonly parent: FormComponent,
    private readonly modalService: ModalService,
    private readonly http: HttpClient,
  ) {
    super(parent);

    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term: any) => {
          if (term.trim().length > 0) {
            return this.http
              .get(this.baseUrl + this.queryUrl + term)
              .pipe(map((results: Result) => results.results));
          } else {
            return of(null);
          }
        }),
      )
      .subscribe(results => {
        this.results = results;
      });
  }

  get dateLabel(): string {
    const value = this.form.get(this.name).value;
    return value ? value.name : this.placeholder;
  }

  open(template: TemplateRef<any>) {
    if (!this.isLoading) {
      this.modal = this.modalService.show(template);
    }
  }

  select(result) {
    this.form.markAsDirty();
    this.form.markAsTouched();

    this.form.patchValue({
      [this.name]: result,
    });

    this.modal.hide();
  }

  confirm() {
    this.modal.hide();
  }
}

interface Result {
  results: [];
  total: number;
}
