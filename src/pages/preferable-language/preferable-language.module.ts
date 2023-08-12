import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreferableLanguagePage } from './preferable-language';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PreferableLanguagePage,
  ],
  imports: [
    IonicPageModule.forChild(PreferableLanguagePage),
    TranslateModule.forChild()
  ],
})
export class PreferableLanguagePageModule {}
