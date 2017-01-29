import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatter } from './../../../node_modules/@angular/common/src/facade/intl';
import * as moment from 'moment';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
    transform(value: any, args: string[]): any {
        if (value) {
            var date = value instanceof Date ? value : moment(value).toDate();
            return DateFormatter.format(date, 'pt', 'dd/MM/yyyy HH:mm:ss');
        }
    }
}