import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatternForgotPage } from './pattern-forgot';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PatternForgotPage,
  ],
  imports: [
    IonicPageModule.forChild(PatternForgotPage),
    TranslateModule.forChild()
  ],
})
export class PatternForgotPageModule {}
