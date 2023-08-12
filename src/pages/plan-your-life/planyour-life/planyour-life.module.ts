import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanyourLifePage } from './planyour-life';
import { RoundSliderComponent } from '../../../components/round-slider/round-slider';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PlanyourLifePage,
       RoundSliderComponent
  ],
  imports: [
    IonicPageModule.forChild(PlanyourLifePage),
    TranslateModule.forChild()
  ],
})
export class PlanyourLifePageModule {}
