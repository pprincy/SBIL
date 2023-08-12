import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TabsPage } from '../../../pages/dashboard/tabs/tabs';

@IonicPage()
@Component({
  selector: 'select-language',
  templateUrl: 'select-language.html',
})
export class SelectLanguagePage {
  public lang: any = [];
  public langId;
  public allowDismiss = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlectLanguagePage');
    this.lang = [
      {
        "id": "1",
        "name": "English",
        "short": "en"
      },
      {
        "id": "2",
        "name": "हिंदी",
        "short": "hi"
      }
    ];
    this.langId = localStorage.getItem("langId");
    console.log(this.navParams.get('allowDismiss'));
    this.allowDismiss = this.navParams.get('allowDismiss');
  }

  langClick(l) {
    this.langId = l.id;
  }

  changeLang() {
   this.dismissModal(true); 
  }

  dismissModal(doChange: boolean) {
    if(doChange || this.allowDismiss)
    this.viewCtrl.dismiss(doChange ? this.langId : "");
  }

}
