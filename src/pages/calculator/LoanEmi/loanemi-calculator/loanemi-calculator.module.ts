import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanemiCalculatorPage } from './loanemi-calculator';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    LoanemiCalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanemiCalculatorPage),
    TranslateModule.forChild()
  ],
})
export class LoanemiCalculatorPageModule {}
