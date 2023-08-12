import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EducationAssetAllocationPage } from './education-asset-allocation';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    EducationAssetAllocationPage,
  ],
  imports: [
    IonicPageModule.forChild(EducationAssetAllocationPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class EducationAssetAllocationPageModule {}
