import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeLoanEligibilityPage } from './home-loan-eligibility';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HomeLoanEligibilityPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeLoanEligibilityPage),
    TranslateModule.forChild()
  ],
})
export class HomeLoanEligibilityPageModule {}
