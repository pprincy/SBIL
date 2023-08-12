import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarriageAssetAllocationPage } from './marriage-asset-allocation';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MarriageAssetAllocationPage
  ],
  imports: [
    IonicPageModule.forChild(MarriageAssetAllocationPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class MarriageAssetAllocationPageModule {}
