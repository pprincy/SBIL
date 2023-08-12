import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RetirementGoalFinalPage } from './retirement-goal-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {RetirementRangeComponent} from '../../../../components/retirement-range/retirement-range';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    RetirementGoalFinalPage,
    RetirementRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(RetirementGoalFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class RetirementGoalFinalPageModule {}


