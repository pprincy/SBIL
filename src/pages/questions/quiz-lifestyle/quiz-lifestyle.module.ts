import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizLifestylePage } from './quiz-lifestyle';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QuizLifestylePage,
  ],
  imports: [
    IonicPageModule.forChild(QuizLifestylePage),
    TranslateModule.forChild(),
  ],
})
export class QuizLifestylePageModule {}
