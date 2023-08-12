import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomeDashboardPage } from './income-dashboard';
import { PipesModule } from '../../../pipes/pipes.module'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    IncomeDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(IncomeDashboardPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class IncomeDashboardPageModule {}
