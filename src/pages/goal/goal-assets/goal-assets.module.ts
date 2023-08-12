import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoalAssetsPage } from './goal-assets';
import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GoalAssetsPage,
  ],
  imports: [
    IonicPageModule.forChild(GoalAssetsPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class GoalAssetsPageModule {}
