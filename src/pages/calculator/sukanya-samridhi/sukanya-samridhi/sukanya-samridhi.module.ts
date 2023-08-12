import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SukanyaSamridhiPage } from './sukanya-samridhi';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    SukanyaSamridhiPage,
  ],
  imports: [
    IonicPageModule.forChild(SukanyaSamridhiPage),
    TranslateModule.forChild()
  ],
})
export class SukanyaSamridhiPageModule {}
