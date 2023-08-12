import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DateagoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateago',
})
export class DateagoPipe implements PipeTransform {

  transform(value: any, args?: any) {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = {
        'Y': 31536000,
        'M': 2592000,
        'W': 604800,
        'D': 86400,
        'H': 3600,
        'Min': 60,
        'Sec': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          // if (counter === 1) {
          return counter + '' + i + ((localStorage.getItem('langId') == "1") ? ' ago' : ' पहले'); // singular (1 day ago)
        // } else {
        //   return counter + ' ' + i + 's ago'; // plural (2 days ago)
        // }
      }
    }
    return value;
  }
}
