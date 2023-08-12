import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditincomePage } from './editincome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EditincomePage,
  ],
  imports: [
    IonicPageModule.forChild(EditincomePage),
    TranslateModule.forChild()
  ],
})
export class EditincomePageModule {}
