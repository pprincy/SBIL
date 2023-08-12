import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeAssetAllocationPage } from './home-asset-allocation';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    HomeAssetAllocationPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeAssetAllocationPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class HomeAssetAllocationPageModule {}
