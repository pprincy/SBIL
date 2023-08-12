import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NpsFinalPage } from './nps-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {SlickSliderComponent} from '../../../../components/slick-slider/slick-slider';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    NpsFinalPage,
    SlickSliderComponent
  ],
  imports: [
    IonicPageModule.forChild(NpsFinalPage),PipesModule,
    TranslateModule.forChild()

  ],
})
export class NpsFinalPageModule {}
