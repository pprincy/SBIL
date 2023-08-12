import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FdpagePage } from './fdpage';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FdpagePage,
  ],
  imports: [
    IonicPageModule.forChild(FdpagePage),
    TranslateModule.forChild()
  ],
})
export class FdpagePageModule {}
