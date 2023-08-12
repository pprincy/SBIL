import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { RatingsPage } from "./ratings";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [RatingsPage],
  imports: [IonicPageModule.forChild(RatingsPage), TranslateModule.forChild()],
})
export class RatingsPageModule {}
