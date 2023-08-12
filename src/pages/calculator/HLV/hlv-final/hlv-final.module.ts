import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HlvFinalPage } from './hlv-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { HlvSliderComponent } from '../../../../components/hlv-slider/hlv-slider';

@NgModule({
  declarations: [
    HlvFinalPage,
    HlvSliderComponent
  ],
  imports: [
    IonicPageModule.forChild(HlvFinalPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class HlvFinalPageModule {}
