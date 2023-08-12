import { Pipe, PipeTransform } from '@angular/core';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
@Pipe({
  name: 'amountFormat',
})
export class AmountFormatPipe implements PipeTransform {
  constructor(public utilitiesProvider: UtilitiesProvider) {
  }
  transform(number: number, args: string) {
    return this.GetRoundingFigure(number, args)
    //return number.toLocaleString('en-IN', {minimumFractionDigits: args});  
  }
  GetRoundingFigure(val: string | number, type: string) {
    let value = "";
    let unit = "";
    if (typeof val !== 'number') {
      val = parseFloat(val);
    }

    if (val < 1000 || isNaN(val)) {
      value = val.toLocaleString('en-IN', { minimumFractionDigits: 0 });
      unit = '';
    }
    else if (val > 999 && val < 100000) {
      value = this.rounding(val / 1000, 2).toString();
      unit = this.utilitiesProvider.commonLangMsg['k'];
    }
    else if (val < 10000000) {
      value = this.rounding(val / 100000, 2).toString();
      if(type == 'L') {
        unit = val>100000 ? this.utilitiesProvider.commonLangMsg['lakhs']
                :this.utilitiesProvider.commonLangMsg['lakh'];
      } else if(type == 'S') {
        unit = this.utilitiesProvider.commonLangMsg['l'];
      } else {
        unit = this.utilitiesProvider.commonLangMsg['lac'];
      }
    }
    else if (val >= 10000000) {
      value = this.rounding(val / 10000000, 2).toString();
      if(type == 'L') {
        unit = val>10000000 ? this.utilitiesProvider.commonLangMsg['crores']
                :this.utilitiesProvider.commonLangMsg['crore'];
      } else {
        unit = this.utilitiesProvider.commonLangMsg['cr'];
      }
    }
    return value + " " + unit;
  }
  // ==============================================
  rounding(a: number, b: number) {
    if (b > 0)
      return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
    else
      return Math.round(Math.round(a * Math.pow(10, b)) / Math.pow(10, b));
  }
}
   // return number.toLocaleString('en-IN', {minimumFractionDigits: args});
