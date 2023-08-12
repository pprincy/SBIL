import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FdFinalPage } from './fd-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {FdRangeComponent} from '../../../../components/fd-range/fd-range'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    FdFinalPage,
    FdRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(FdFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class FdFinalPageModule {}
