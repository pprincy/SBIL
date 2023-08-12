import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizQuestionsPage } from './quiz-questions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QuizQuestionsPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizQuestionsPage),
    TranslateModule.forChild()
  ],
})
export class QuizPageModule {}
