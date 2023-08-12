import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SukanyasamridhiFinalPage } from './sukanyasamridhi-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {SukanyaRangeSliderComponent} from '../../../../components/sukanya-range-slider/sukanya-range-slider';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    SukanyasamridhiFinalPage,SukanyaRangeSliderComponent
  ],
  imports: [
    IonicPageModule.forChild(SukanyasamridhiFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class SukanyasamridhiFinalPageModule {}
