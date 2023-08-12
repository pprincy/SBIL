import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuitSmokingPage } from './quit-smoking';
import {SmokingRangeComponent} from '../../../components/smoking-range/smoking-range';
import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    QuitSmokingPage,
    SmokingRangeComponent
  ],
  imports: [
    IonicPageModule.forChild(QuitSmokingPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class QuitSmokingPageModule {}
