import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RetirementAssetAllocationPage } from './retirement-asset-allocation';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    RetirementAssetAllocationPage,
  ],
  imports: [
    IonicPageModule.forChild(RetirementAssetAllocationPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class RetirementAssetAllocationPageModule {}
