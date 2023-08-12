import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDefaultPage } from './user-default';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    UserDefaultPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDefaultPage), PipesModule,
    TranslateModule.forChild(),
  ],
})
export class UserDefaultPageModule {}
