import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionDetailsPage } from './collection-details';

@NgModule({
  declarations: [
    CollectionDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectionDetailsPage),
  ],
})
export class CollectionDetailsPageModule {}
