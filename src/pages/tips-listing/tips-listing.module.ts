import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TipsListingPage } from './tips-listing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TipsListingPage,
  ],
  imports: [
    IonicPageModule.forChild(TipsListingPage),
    TranslateModule.forChild(),

  ],
})
export class TipsListingPageModule {}
