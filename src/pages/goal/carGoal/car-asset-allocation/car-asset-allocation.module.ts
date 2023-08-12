import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarAssetAllocationPage } from './car-asset-allocation';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CarAssetAllocationPage,
  ],
  imports: [
    IonicPageModule.forChild(CarAssetAllocationPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class CarAssetAllocationPageModule {}
