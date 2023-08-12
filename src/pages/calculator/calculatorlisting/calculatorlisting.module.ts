import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculatorlistingPage } from './calculatorlisting';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CalculatorlistingPage,
  ],
  imports: [
    IonicPageModule.forChild(CalculatorlistingPage),
    TranslateModule.forChild(),
  ],
})
export class CalculatorlistingPageModule {}
