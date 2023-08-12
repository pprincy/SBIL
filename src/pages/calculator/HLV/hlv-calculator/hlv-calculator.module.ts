import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HlvCalculatorPage } from './hlv-calculator';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HlvCalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(HlvCalculatorPage),
    TranslateModule.forChild()
  ],
})
export class HlvCalculatorPageModule {}
