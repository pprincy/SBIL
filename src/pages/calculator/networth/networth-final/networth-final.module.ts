import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworthFinalPage } from './networth-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {RangeSelectComponent} from '../../../../components/range-select/range-select';
import {ComponentsModule} from '../../../../components/components.module'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    NetworthFinalPage,
    RangeSelectComponent
  ],
  imports: [
    IonicPageModule.forChild(NetworthFinalPage), PipesModule,
    TranslateModule.forChild()
  ]
})
export class NetworthFinalPageModule {}
