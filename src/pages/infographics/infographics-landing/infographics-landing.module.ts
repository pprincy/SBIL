import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfographicsLandingPage } from './infographics-landing';

@NgModule({
  declarations: [
    InfographicsLandingPage,
  ],
  imports: [
    IonicPageModule.forChild(InfographicsLandingPage),
  ],
})
export class InfographicsLandingPageModule {}
