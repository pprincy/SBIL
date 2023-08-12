import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MySpentPage } from './my-spent';
import { TranslateModule } from '@ngx-translate/core';
import {CalendarModule} from "ion2-calendar";
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    MySpentPage,
  ],
  imports: [
    IonicPageModule.forChild(MySpentPage),
    PipesModule,
    TranslateModule.forChild(),
    CalendarModule
  ],
})
export class MySpentPageModule {}
