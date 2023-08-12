import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleDetailsPage } from './article-details';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../pipes/pipes.module';
// import { TextAvatarDirective } from '../../../directives/text-avatar/text-avatar';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    ArticleDetailsPage,
    // TextAvatarDirective
  ],
  imports: [
    IonicPageModule.forChild(ArticleDetailsPage),
    TranslateModule.forChild(),
    PipesModule,
    DirectivesModule
  ],
})
export class ArticleDetailsPageModule {}
