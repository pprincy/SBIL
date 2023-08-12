import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseListingPage } from './expense-listing';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ExpenseListingPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseListingPage),
    TranslateModule.forChild()
  ],
})
export class ExpenseListingPageModule {}
