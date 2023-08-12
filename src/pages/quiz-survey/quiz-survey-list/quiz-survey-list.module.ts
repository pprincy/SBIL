import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizSurveyListPage } from './quiz-survey-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QuizSurveyListPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizSurveyListPage),
    TranslateModule.forChild()
  ],
})
export class QuizSurveyListPageModule {}
