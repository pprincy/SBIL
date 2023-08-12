import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomGoalPage } from './custom-goal';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CustomGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomGoalPage),
    TranslateModule.forChild()
  ],
})
export class CustomGoalPageModule {}
