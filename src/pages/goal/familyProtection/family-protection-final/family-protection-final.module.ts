import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyProtectionFinalPage } from './family-protection-final';
import { PipesModule } from '../../../../pipes/pipes.module';
import {FaimilyProtectionComponent} from '../../../../components/faimily-protection/faimily-protection'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FamilyProtectionFinalPage,
    FaimilyProtectionComponent
  ],
  imports: [
    IonicPageModule.forChild(FamilyProtectionFinalPage),
    TranslateModule.forChild(),
    PipesModule
  ],
})
export class FamilyProtectionFinalPageModule {}
