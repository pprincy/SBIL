import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MpinSetPage } from './mpin-set';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MpinSetPage,
  ],
  imports: [
    IonicPageModule.forChild(MpinSetPage),
    TranslateModule.forChild()
  ],
})
export class MpinSetPageModule {}
