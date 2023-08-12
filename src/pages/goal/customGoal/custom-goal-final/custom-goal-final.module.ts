import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomGoalFinalPage } from './custom-goal-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {TargetRangeComponent} from '../../../../components/target-range/target-range';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CustomGoalFinalPage,
    TargetRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(CustomGoalFinalPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class CustomGoalFinalPageModule {}
