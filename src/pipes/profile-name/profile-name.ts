import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ProfileNamePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'profileName',
})
export class ProfileNamePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, args?: any) {
    if (value) {
      var arr = value.split(" ");

      if(arr.length > 1) {
        value = (arr[0].slice(0,1) + arr[1].slice(0,1)).toUpperCase();
      }
      else {
        value = (arr[0].slice(0,1)).toUpperCase();
      }
    }
    return value;
  }
}
