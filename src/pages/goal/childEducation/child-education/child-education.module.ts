import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChildEducationPage } from './child-education';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChildEducationPage,
  ],
  imports: [
    IonicPageModule.forChild(ChildEducationPage),
    TranslateModule.forChild()

  ],
})
export class ChildEducationPageModule {}
