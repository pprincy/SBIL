import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiskAssesmentPage } from './risk-assesment';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    RiskAssesmentPage,
  ],
  imports: [
    IonicPageModule.forChild(RiskAssesmentPage),
    TranslateModule.forChild()
  ],
})
export class RiskAssesmentPageModule {}
