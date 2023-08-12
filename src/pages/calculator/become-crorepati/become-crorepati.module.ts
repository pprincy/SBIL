import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BecomeCrorepatiPage } from './become-crorepati';
 import { PipesModule } from '../../../pipes/pipes.module';
import {CrorepatiRangeComponent} from '../../../components/crorepati-range/crorepati-range';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    BecomeCrorepatiPage,
    CrorepatiRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(BecomeCrorepatiPage), PipesModule,
    TranslateModule.forChild()
  ],
})
export class BecomeCrorepatiPageModule {}
