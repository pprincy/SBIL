import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomeapproximationPage } from './incomeapproximation';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../pipes/pipes.module'
@NgModule({
  declarations: [
    IncomeapproximationPage,
  ],
  imports: [
    IonicPageModule.forChild(IncomeapproximationPage),PipesModule,
    TranslateModule.forChild()
  ],
})
export class IncomeapproximationPageModule {}
