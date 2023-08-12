import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
@IonicPage()
@Component({
  selector: 'page-unregisteredcustomer',
  templateUrl: 'unregisteredcustomer.html',
})
export class UnregisteredcustomerPage {
  public mobile;
  public url;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    public utilitiesProvider: UtilitiesProvider) {
  }
  ionViewDidEnter() {
    this.utilitiesProvider.googleAnalyticsTrackView('User Not Exist Page');
    let loginType = this.navParams.get("loginType");
    if (loginType == "Mobile") {
      this.mobile = true;
      this.url = 'https://sbilife.co.in/en/about-us/contact-us';
    }
    else {
      this.mobile = false;
      this.url = 'https://apnapolicy.sbilife.co.in/econnectmail/register.do?sid=13t/iJb6iYPNmYrHOD3khA==';
    }
  }
  goBrowser() {
    this.iab.create(this.url);
  }
  reEnter() {
    this.navCtrl.pop();
  }
}
