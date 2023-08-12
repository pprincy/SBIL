import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpensestrendPage } from './expensestrend';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../pipes/pipes.module'
@NgModule({
  declarations: [
    ExpensestrendPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpensestrendPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class ExpensestrendPageModule {}
