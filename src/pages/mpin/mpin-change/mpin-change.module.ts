import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MpinChangePage } from './mpin-change';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MpinChangePage,
  ],
  imports: [
    IonicPageModule.forChild(MpinChangePage),
    TranslateModule.forChild()
  ],
})
export class MpinChangePageModule {}
