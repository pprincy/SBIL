import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarriagePage } from './marriage';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MarriagePage,
  ],
  imports: [
    IonicPageModule.forChild(MarriagePage),
    TranslateModule.forChild()
  ],
})
export class MarriagePageModule {}
