import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatternLockPage } from './pattern-lock';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PatternLockPage,
  ],
  imports: [
    IonicPageModule.forChild(PatternLockPage),
    TranslateModule.forChild()
  ],
})
export class PatternLockPageModule {}
