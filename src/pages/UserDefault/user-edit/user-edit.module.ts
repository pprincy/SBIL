import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserEditPage } from './user-edit';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserEditPage,
  ],
  imports: [
    IonicPageModule.forChild(UserEditPage),
    TranslateModule.forChild(),
  ],
})
export class UserEditPageModule {}
