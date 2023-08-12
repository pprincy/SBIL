import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanSummaryPage } from './plan-summary';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PlanSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(PlanSummaryPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class PlanSummaryPageModule {}
