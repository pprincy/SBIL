import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CargoalfinalPage } from './cargoalfinal';
import {CarRangeComponent} from '../../../../components/car-range/car-range';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CargoalfinalPage,CarRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(CargoalfinalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class CargoalfinalPageModule {}
