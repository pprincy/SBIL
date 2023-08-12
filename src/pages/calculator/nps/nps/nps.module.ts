import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NpsPage } from './nps';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NpsPage
  ],
  imports: [
    IonicPageModule.forChild(NpsPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class NpsPageModule {}
