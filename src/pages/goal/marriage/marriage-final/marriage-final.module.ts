import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarriageFinalPage } from './marriage-final';
import {MarriageRangeComponent} from '../../../../components/marriage-range/marriage-range';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MarriageFinalPage,MarriageRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(MarriageFinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class MarriageFinalPageModule {}
