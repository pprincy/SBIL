import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SipCalculatorPage } from './sip-calculator';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    SipCalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(SipCalculatorPage),
    TranslateModule.forChild()
  ],
})
export class SipCalculatorPageModule {}
