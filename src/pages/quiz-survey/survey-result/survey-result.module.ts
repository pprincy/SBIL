import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyResultPage } from './survey-result';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SurveyResultPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyResultPage),
    TranslateModule.forChild()
  ],
})
export class SurveyResultPageModule {}
