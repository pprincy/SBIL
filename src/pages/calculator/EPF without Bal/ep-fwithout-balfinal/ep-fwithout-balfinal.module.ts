import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpFwithoutBalfinalPage } from './ep-fwithout-balfinal';
import { PipesModule } from '../../../../pipes/pipes.module';
// import {FdRangeComponent} from '../../../../components/fd-range/fd-range'

@NgModule({
  declarations: [
    EpFwithoutBalfinalPage,
    // FdRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(EpFwithoutBalfinalPage),PipesModule
  ],
})
export class EpFwithoutBalfinalPageModule {}
