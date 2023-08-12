import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnregisteredcustomerPage } from './unregisteredcustomer';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UnregisteredcustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(UnregisteredcustomerPage),
    TranslateModule.forChild()
  ],
})
export class UnregisteredcustomerPageModule {}
