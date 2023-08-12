import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PpfWithAccPage } from './ppf-with-acc';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PpfWithAccPage,
  ],
  imports: [
    IonicPageModule.forChild(PpfWithAccPage),
    TranslateModule.forChild()
  ],
})
export class PpfwithoutBalPageModule {}
