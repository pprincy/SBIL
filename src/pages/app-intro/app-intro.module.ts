import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppIntroPage } from './app-intro';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppIntroPage,
  ],
  imports: [
    IonicPageModule.forChild(AppIntroPage),
    TranslateModule.forChild()
  ],
})
export class AppIntroPageModule {}
