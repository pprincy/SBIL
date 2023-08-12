import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddexpensesPage } from './addexpenses';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableValueAccessor } from './contenteditable.directive';

@NgModule({
  declarations: [
    AddexpensesPage,
    ContenteditableValueAccessor,
  ],
  imports: [
    IonicPageModule.forChild(AddexpensesPage),
    TranslateModule.forChild()
  ],
})
export class AddexpensesPageModule {}
