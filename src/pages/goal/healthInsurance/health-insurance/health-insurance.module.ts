import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthInsurancePage } from './health-insurance';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    HealthInsurancePage,
  ],
  imports: [
    IonicPageModule.forChild(HealthInsurancePage),
    TranslateModule.forChild()
  ],
})
export class HealthInsurancePageModule {}
