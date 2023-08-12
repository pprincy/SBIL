import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EatingOutPage } from './eating-out';
import {EatingOutComponent} from '../../../components/eating-out/eating-out';
import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    EatingOutPage,EatingOutComponent
  ],
  imports: [
    IonicPageModule.forChild(EatingOutPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class EatingOutPageModule {}
