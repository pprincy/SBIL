import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyProtectionPage } from './family-protection';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FamilyProtectionPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyProtectionPage),
    TranslateModule.forChild()

  ],
})
export class FamilyProtectionPageModule {}
