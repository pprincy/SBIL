import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpPage } from './otp';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OtpPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpPage),
    TranslateModule.forChild(),

  ],
})
export class OtpPageModule {}
