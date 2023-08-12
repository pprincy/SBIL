import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeGoalFinalPage } from './home-goal-final';
import {GoalHomeRangeComponent} from '../../../../components/goal-home-range/goal-home-range';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    HomeGoalFinalPage,GoalHomeRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(HomeGoalFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class HomeGoalFinalPageModule {}
