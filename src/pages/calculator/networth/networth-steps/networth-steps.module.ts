import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworthStepsPage } from './networth-steps';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    NetworthStepsPage,
  ],
  imports: [
    IonicPageModule.forChild(NetworthStepsPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class NetworthStepsPageModule {}
