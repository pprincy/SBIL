import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MpinLoginPage } from './mpin-login';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MpinLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(MpinLoginPage),
    TranslateModule.forChild()
  ],
})
export class MpinLoginPageModule {}
