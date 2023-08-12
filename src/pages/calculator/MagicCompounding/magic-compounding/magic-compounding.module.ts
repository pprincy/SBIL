import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MagicCompoundingPage } from './magic-compounding';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MagicCompoundingPage,
  ],
  imports: [
    IonicPageModule.forChild(MagicCompoundingPage),
    TranslateModule.forChild()
  ],
})
export class MagicCompoundingPageModule {}
