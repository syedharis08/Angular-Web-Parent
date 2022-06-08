import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'datex'
})

export class DatexPipe implements PipeTransform {
    transform(value: any, format: string = ''): string {
        let monthBe = new Date(value).getMonth();
        if (format == 'MMM. D, YYYY' && monthBe == 4) {
            format = 'MMM D, YYYY';
        }
        if (format == 'dddd, MMM. D, YYYY' && monthBe == 4) {
            format = 'dddd, MMM D, YYYY';
        }
        if (format == 'MMM. D' && monthBe == 4) {
            format = 'MMM D';
        }
        let momentDate = moment(value);
        // If moment didn't understand the value, return it unformatted.
        if (!momentDate.isValid()) return value;
        // Otherwise, return the date formatted as requested.
        return moment(new Date(value)).format(format);
    }
}
