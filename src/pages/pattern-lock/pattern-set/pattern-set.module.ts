import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatternSetPage } from './pattern-set';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PatternSetPage,
  ],
  imports: [
    IonicPageModule.forChild(PatternSetPage),
    TranslateModule.forChild()
  ],
})
export class PatternSetPageModule {}
