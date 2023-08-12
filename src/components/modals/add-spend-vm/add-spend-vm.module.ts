import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSpendVmPage } from './add-spend-vm';

@NgModule({
  declarations: [
    AddSpendVmPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSpendVmPage),
  ],
})
export class AddSpendVmPageModule {}
