import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomGoalAssetAllocationPage } from './custom-goal-asset-allocation';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CustomGoalAssetAllocationPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomGoalAssetAllocationPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class CustomGoalAssetAllocationPageModule {}
