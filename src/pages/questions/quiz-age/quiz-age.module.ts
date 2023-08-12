import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizAgePage } from './quiz-age';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QuizAgePage,
  ],
  imports: [
    IonicPageModule.forChild(QuizAgePage),
    TranslateModule.forChild()
  ],
})
export class QuizAgePageModule {}
