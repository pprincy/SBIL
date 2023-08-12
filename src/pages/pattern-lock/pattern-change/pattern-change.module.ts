import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatternChangePage } from './pattern-change';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PatternChangePage,
  ],
  imports: [
    IonicPageModule.forChild(PatternChangePage),
    TranslateModule.forChild()
  ],
})
export class PatternChangePageModule {}
