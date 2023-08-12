import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CargoalPage } from './cargoal';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CargoalPage,
  ],
  imports: [
    IonicPageModule.forChild(CargoalPage),
    TranslateModule.forChild()
  ],
})
export class CargoalPageModule {}
