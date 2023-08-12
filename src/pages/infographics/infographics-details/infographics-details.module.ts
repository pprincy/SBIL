import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfographicsDetailsPage } from './infographics-details';

@NgModule({
  declarations: [
    InfographicsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(InfographicsDetailsPage),
  ],
})
export class InfographicsDetailsPageModule {}
