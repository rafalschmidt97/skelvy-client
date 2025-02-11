import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(date: string | Date): number {
    return moment().diff(moment(date), 'years');
  }
}
