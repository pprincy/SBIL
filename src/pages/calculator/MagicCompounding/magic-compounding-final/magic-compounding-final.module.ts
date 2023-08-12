import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MagicCompoundingFinalPage } from './magic-compounding-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {MagicCompoundRangeComponent} from '../../../../components/magic-compound-range/magic-compound-range'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MagicCompoundingFinalPage,MagicCompoundRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(MagicCompoundingFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class MagicCompoundingFinalPageModule {}
