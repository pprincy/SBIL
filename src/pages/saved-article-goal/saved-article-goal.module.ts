import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedArticleGoalPage } from './saved-article-goal';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    SavedArticleGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedArticleGoalPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class SavedArticleGoalPageModule {}
