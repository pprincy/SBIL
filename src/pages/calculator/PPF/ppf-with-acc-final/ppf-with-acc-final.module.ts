import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PpfWithAccFinalPage } from './ppf-with-acc-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {PpfWithAccRangeComponent} from '../../../../components/ppf-with-acc-range/ppf-with-acc-range';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PpfWithAccFinalPage,
    PpfWithAccRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(PpfWithAccFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class PpfWithAccFinalPageModule {}
