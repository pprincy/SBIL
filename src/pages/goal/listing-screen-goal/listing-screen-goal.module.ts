import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListingScreenGoalPage } from './listing-screen-goal';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ListingScreenGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(ListingScreenGoalPage),
    TranslateModule.forChild(),

  ],
})
export class ListingScreenGoalPageModule {}
