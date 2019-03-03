import { BehaviorSubject, Observable } from 'rxjs';

export abstract class StoreService<T> {
  protected readonly subject: BehaviorSubject<T> = new BehaviorSubject(null);
  readonly data$: Observable<T> = this.subject.asObservable();

  set(data: T) {
    this.subject.next(data);
  }

  get data() {
    return this.subject.getValue();
  }
}
