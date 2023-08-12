import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-mpin',
  templateUrl: 'mpin.html',
})
export class MpinPage {
  public mpin: any = '';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp) {
      // alert(this.restapiProvider.userData['MPINTYPE'])
      console.log(JSON.stringify(this.restapiProvider.userData));
    this.mpin = this.restapiProvider.userData['MPINFlag'];
    if (this.restapiProvider.userData['MPINTYPE']) {
      this.mpin = 'mpin';
    }
    else {
      this.mpin = '';
    }
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("45");
    this.utilitiesProvider.googleAnalyticsTrackView('MpinLanding');

    this.utilitiesProvider.upshotScreenView('M-Pin');
  }
  setMpin() {
    if (this.restapiProvider.userData['MPINTYPE']) {
      if (this.restapiProvider.userData['MPINTYPE'] == 'mpin') {
        this.navCtrl.push('MpinSetPage');
      }
      else {
        this.navCtrl.push('PatternSetPage');
      }
    }
    else {
      this.navCtrl.push('MpinSetPage');
    }
  }
  changeMpin() {
    if (this.restapiProvider.userData['MPINTYPE'] == 'mpin') {
      this.navCtrl.push('MpinChangePage');
    }
    else {
      this.navCtrl.push('PatternChangePage');
    }
  }
}
