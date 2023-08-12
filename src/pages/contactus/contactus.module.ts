import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactusPage } from './contactus';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactusPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactusPage),
    TranslateModule.forChild()

  ],
})
export class ContactusPageModule {}
