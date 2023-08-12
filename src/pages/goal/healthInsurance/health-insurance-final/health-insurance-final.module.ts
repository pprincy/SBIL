import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthInsuranceFinalPage } from './health-insurance-final';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import {HealthInsuranceComponent} from '../../../../components/health-insurance/health-insurance'
@NgModule({
  declarations: [
    HealthInsuranceFinalPage,
    HealthInsuranceComponent
  ],
  imports: [
    IonicPageModule.forChild(HealthInsuranceFinalPage),
    TranslateModule.forChild(), PipesModule

  ],
})
export class HealthInsuranceFinalPageModule {}
