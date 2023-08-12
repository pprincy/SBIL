import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChildeducationfinalPage } from './childeducationfinal';
import {EducationRangeComponent} from '../../../../components/education-range/education-range';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChildeducationfinalPage,EducationRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(ChildeducationfinalPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class ChildeducationfinalPageModule {}
