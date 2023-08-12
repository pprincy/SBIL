import { NgModule                     } from '@angular/core';
import { IonicPageModule              } from 'ionic-angular';
import { PipesModule                  } from '../../../../pipes/pipes.module';
import { HomeLoanEligibilityFinalPage } from './home-loan-eligibility-final';
import { HomeloanEligRangeComponent   } from '../../../../components/homeloan-elig-range/homeloan-elig-range';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    HomeLoanEligibilityFinalPage,
	  HomeloanEligRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(HomeLoanEligibilityFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class HomeLoanEligibilityFinalPageModule {}
