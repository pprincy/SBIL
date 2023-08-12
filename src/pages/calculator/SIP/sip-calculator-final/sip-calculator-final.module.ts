import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../../pipes/pipes.module';
import { SipCalculatorFinalPage } from './sip-calculator-final';
import { SipRangeComponent } from  '../../../../components/sip-range/sip-range';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SipCalculatorFinalPage,
    SipRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(SipCalculatorFinalPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class SipCalculatorFinalPageModule {}
