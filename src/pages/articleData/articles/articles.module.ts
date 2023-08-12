import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticlesPage } from './articles';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ArticlesPage,
  ],
  imports: [
    IonicPageModule.forChild(ArticlesPage),
    TranslateModule.forChild(),

  ],
})
export class ArticlesPageModule {}