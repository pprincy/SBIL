import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutusPage } from './aboutus';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AboutusPage
  ],
  imports: [
    IonicPageModule.forChild(AboutusPage),
    TranslateModule.forChild(),
  ],
})
export class AboutusPageModule {}
