import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../../pipes/pipes.module';
import { LoanemiCalculatorFinalPage } from './loanemi-calculator-final';
import { LoanEmiRangeComponent } from '../../../../components/loan-emi-range/loan-emi-range';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LoanemiCalculatorFinalPage,
    LoanEmiRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(LoanemiCalculatorFinalPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class LoanemiCalculatorFinalPageModule {}
