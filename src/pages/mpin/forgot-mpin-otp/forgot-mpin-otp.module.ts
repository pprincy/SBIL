import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotMpinOtpPage } from './forgot-mpin-otp';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ForgotMpinOtpPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotMpinOtpPage),
    TranslateModule.forChild()
  ],
})
export class ForgotMpinOtpPageModule {}
