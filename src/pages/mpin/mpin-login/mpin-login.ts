import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { TabsPage } from '../../dashboard/tabs/tabs';
import { MyApp } from '../../../app/app.component';
import { MenuController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-mpin-login',
  templateUrl: 'mpin-login.html',
})
export class MpinLoginPage {
  public keyboardShow = false;
  public otpNum1: any;
  public otpNum2: any;
  public otpNum3: any;
  public otpNum4: any;
  public methodName;
  public setMPinStep: any = '1';
  public otpSet: any = [];
  public otpSetFinalArray: any = [];
  public otpSetFinal: any;
  public otpConfirmFinal: any;
  public showError: boolean = false;
  public pageLoader: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private network: Network,
    public utilitiesProvider: UtilitiesProvider,
    public platform: Platform,
    public menu: MenuController,
    public myApp: MyApp) {
  }
  ionViewDidLoad() {
    this.menu.enable(false, 'sidemenu');
  }
  inputBtnClick() {
    this.keyboardShow = true;
    $('.footer_panel').removeClass('active');
  }
  hideKeyboard() {
    this.keyboardShow = false;
    $('.footer_panel').addClass('active');
  }
  numClickFunction(n) {
    if (this.otpSet.length < 4) {
      $('.btnOtp').removeClass('wrong_otp');
      $('.wrong_otp_msg').addClass('hide');
      this.otpSet.push(n);
      for (let i = 0; i < this.otpSet.length; i++) {
        if (i == 0) {
          this.otpNum1 = this.otpSet[0];
        }
        if (i == 1) {
          this.otpNum2 = this.otpSet[1];
        }
        if (i == 2) {
          this.otpNum3 = this.otpSet[2];
        }
        if (i == 3) {
          this.otpNum4 = this.otpSet[3];
          this.keyboardShow = false;
          $('.footer_panel').addClass('active');
        }
      }
    }
  }
  numBackClick() {
    $('.btnOtp').removeClass('wrong_otp');
    $('.wrong_otp_msg').addClass('hide');
    this.otpSet.splice(-1);
    if (this.otpSet.length == 0) {
      this.otpNum1 = '';
    }
    if (this.otpSet.length == 1) {
      this.otpNum2 = '';
    }
    if (this.otpSet.length == 2) {
      this.otpNum3 = '';
    }
    if (this.otpSet.length == 3) {
      this.otpNum4 = '';
    }
  }
  next() {
    if (this.setMPinStep == '1') {
      let mpinEnter = this.otpNum1 + this.otpNum2 + this.otpNum3 + this.otpNum4;
      if (mpinEnter.length == 4 && !isNaN(parseInt(mpinEnter))) {
        this.verifyMpin(mpinEnter)
      }
    }
  }
  back() {
    this.otpSet = this.otpSetFinalArray;
    this.otpNum1 = this.otpSetFinalArray[0];
    this.otpNum2 = this.otpSetFinalArray[1];
    this.otpNum3 = this.otpSetFinalArray[2];
    this.otpNum4 = this.otpSetFinalArray[3];
    this.setMPinStep = '1';
    $('.wrong_otp_msg').addClass('hide');
  }
  clearSet() {
    this.otpSet = [];
    this.otpNum1 = '';
    this.otpNum2 = '';
    this.otpNum3 = '';
    this.otpNum4 = '';
  }
  gotIt() {
    this.navCtrl.setRoot(TabsPage);
  }
  updateProfile() {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.pageLoader = true;
      let requestUpdateProfile = {
        "LoginSource": "APP",
        "CustId": this.restapiProvider.userData['CustomerID'],
        "Gender": this.restapiProvider.userData['gender'],
        "MPIN": this.otpConfirmFinal,
        "MpinType": "mpin",
        "Age": this.restapiProvider.userData['age'],
        "MaritalStatus": this.restapiProvider.userData['maritialStatus'],
        "IncomeGroup": this.restapiProvider.userData['incomeGroup'],
        "SegmentId": null,
        "OccupationId": this.restapiProvider.userData['occupationID'],
        "PersonaId": null,
        "TokenId": this.restapiProvider.userData['tokenId'],
        "Image": this.restapiProvider.userData['profileImg']
      }
      this.restapiProvider.sendRestApiRequest(requestUpdateProfile, 'updateProfile')
        .subscribe((response) => {
          this.pageLoader = false;
          if (response.IsSuccess == true) {
            this.setMPinStep = '3';
            this.myApp.updatePageUseCount("49");
            this.utilitiesProvider.googleAnalyticsTrackView('PinLogin');
            this.restapiProvider.userData['mpin'] = this.otpConfirmFinal;
            this.restapiProvider.userData['MPINTYPE'] = 'mpin';
            this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
            if (this.platform.is('core') || this.platform.is('mobileweb')) {
              localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
            }
          }
        }, (error) => {
          this.pageLoader = false;
        })
    }
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
            }
            else if (response.Data.Table[0].Status == "Token Expired") {
              this.utilitiesProvider.presentToastTop("Session expired!!!");
              this.navCtrl.setRoot('LoginPage');
            }
            else {
              $('.wrong_otp_msg').removeClass('hide');
              $('.btnOtp').addClass('wrong_otp');
            }
            // if(response.Data.Table[0].Status != "Failure"){
            //   this.navCtrl.setRoot(TabsPage);
            // }
            // else{
            //   $('.wrong_otp_msg').removeClass('hide');
            //   $('.btnOtp').addClass('wrong_otp');
            // }
          }
        }, (error) => {
          this.pageLoader = false;
          $('.wrong_otp_msg').removeClass('hide');
          $('.btnOtp').addClass('wrong_otp');
        })
    }
  }
  forgotMpin() {
    this.navCtrl.push('ForgotMpinLoginPage')
  }
  pattern() {
    this.navCtrl.push('PatternSetPage')
  }
}

