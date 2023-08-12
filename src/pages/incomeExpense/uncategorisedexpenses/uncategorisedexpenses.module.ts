import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UncategorisedexpensesPage } from './uncategorisedexpenses';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    UncategorisedexpensesPage,
  ],
  imports: [
    IonicPageModule.forChild(UncategorisedexpensesPage),
    TranslateModule.forChild()

  ],
})
export class UncategorisedexpensesPageModule {}
