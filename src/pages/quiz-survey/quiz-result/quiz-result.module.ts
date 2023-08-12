import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizResultPage } from './quiz-result';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QuizResultPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizResultPage),
    TranslateModule.forChild()
  ],
})
export class QuizResultPageModule {}
