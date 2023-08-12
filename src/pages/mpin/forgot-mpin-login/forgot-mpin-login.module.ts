import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotMpinLoginPage } from './forgot-mpin-login';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ForgotMpinLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotMpinLoginPage),
    TranslateModule.forChild()
  ],
})
export class ForgotMpinLoginPageModule {}
