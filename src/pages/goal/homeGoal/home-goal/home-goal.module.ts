import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeGoalPage } from './home-goal';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    HomeGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeGoalPage),
    TranslateModule.forChild()
  ],
})
export class HomeGoalPageModule {}
