import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyQuestionsPage } from './survey-questions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SurveyQuestionsPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyQuestionsPage),
    TranslateModule.forChild()
  ],
})
export class SurveyQuestionsPageModule {}
