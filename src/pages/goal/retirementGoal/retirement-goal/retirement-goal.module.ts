import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RetirementGoalPage } from './retirement-goal';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    RetirementGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(RetirementGoalPage),
    TranslateModule.forChild()
  ],
})
export class RetirementGoalPageModule {}
