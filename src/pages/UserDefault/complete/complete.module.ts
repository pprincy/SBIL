import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletePage } from './complete';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CompletePage,
  ],
  imports: [
    IonicPageModule.forChild(CompletePage),
    TranslateModule.forChild()
  ],
})
export class CompletePageModule {}
