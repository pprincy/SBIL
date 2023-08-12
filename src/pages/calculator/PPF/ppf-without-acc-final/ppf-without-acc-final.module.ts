import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PpfWithoutAccFinalPage } from './ppf-without-acc-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {PpfWithoutAccRangeComponent} from '../../../../components/ppf-without-acc-range/ppf-without-acc-range';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PpfWithoutAccFinalPage,
    PpfWithoutAccRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(PpfWithoutAccFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class PpfWithoutAccFinalPageModule {}
