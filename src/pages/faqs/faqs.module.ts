import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqsPage } from './faqs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FaqsPage,
  ],
  imports: [
    IonicPageModule.forChild(FaqsPage),
    TranslateModule.forChild(),
  ],
})
export class FaqsPageModule {}
