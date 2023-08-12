import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MpinPage } from './mpin';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MpinPage,
  ],
  imports: [
    IonicPageModule.forChild(MpinPage),
    TranslateModule.forChild()
  ],
})
export class MpinPageModule {}
