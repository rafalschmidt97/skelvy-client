import { BehaviorSubject, Observable } from 'rxjs';

export abstract class StoreService<T> {
  private subject: BehaviorSubject<T> = new BehaviorSubject(null);
  readonly data: Observable<T> = this.subject.asObservable();

  set(data: T) {
    this.subject.next(data);
  }
}
