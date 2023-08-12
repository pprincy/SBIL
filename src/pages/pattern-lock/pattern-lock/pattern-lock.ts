import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as $ from 'jquery';
import * as patternLock from 'PatternLock';
import { TabsPage } from '../../dashboard/tabs/tabs';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { Network } from '@ionic-native/network';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
import { MenuController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-pattern-lock',
  templateUrl: 'pattern-lock.html',
})
export class PatternLockPage {
  public pageLoader: boolean = false;
  public lock;
  public setPattern;
  public confirmPattern;
  public showForgotPass: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private network: Network,
    public utilitiesProvider: UtilitiesProvider,
    public menu: MenuController,
    public platform: Platform,
    public myApp: MyApp) {
  }
  ionViewDidLoad() {
    this.menu.enable(false, 'sidemenu');
    setTimeout(() => {
      setTimeout(() => {
        this.showForgotPass = true;
      }, 500)
      var that = this;
      this.lock = new patternLock('#patternHolder1', {
        onDraw: function (pattern) {
          if (pattern.length < 4) {
            that.lock.error();
            $('.wrong_otp_msg').removeClass('hide');
          }
          else {
            that.verifyMpin(pattern);
          }
        }
      });
    }, 200);
  }
  resetPattern() {
    this.lock.reset();
  }
  errorPattern() {
    this.lock.error();
  }
  removePatternWrong() {
    $('.wrong_otp_msg').addClass('hide');
  }
  verifyMpin(pin) {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.pageLoader = true;
      let requestUpdateProfile = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        "TokenId": this.restapiProvider.userData['tokenId'],
        "MPIN": pin,
      }
      this.restapiProvider.sendRestApiRequest(requestUpdateProfile, 'VerifyMPIN')
        .subscribe((response) => {
          this.pageLoader = false;
          if (response.IsSuccess == true) {
            if (response.Data.Table[0].Status == "Success") {
              this.navCtrl.setRoot(TabsPage);
              this.myApp.updatePageUseCount("53");
              this.utilitiesProvider.googleAnalyticsTrackView('PatternLogin');
            }
            else if (response.Data.Table[0].Status == "Token Expired") {
              this.utilitiesProvider.presentToastTop("Session expired!!!");
              this.navCtrl.setRoot('LoginPage');
            }
            else {
              $('.wrong_otp_msg').removeClass('hide');
              $('.btnOtp').addClass('wrong_otp');
              this.lock.error();
            }
          }
        }, (error) => {
          this.pageLoader = false;
          $('.wrong_otp_msg').removeClass('hide');
          $('.btnOtp').addClass('wrong_otp');
          this.lock.error();
        })
    }
  }
  forgotPattern() {
    this.navCtrl.push('ForgotMpinLoginPage')
  }
}
