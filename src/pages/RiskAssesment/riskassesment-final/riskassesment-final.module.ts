import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiskassesmentFinalPage } from './riskassesment-final';
import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    RiskassesmentFinalPage
  ],
  imports: [
    IonicPageModule.forChild(RiskassesmentFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class RiskassesmentFinalPageModule {}
