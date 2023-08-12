import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { TabsPage } from '../../dashboard/tabs/tabs';
import { MyApp } from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-mpin-change',
  templateUrl: 'mpin-change.html',
})
export class MpinChangePage {
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
  public mpin: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private network: Network,
    public utilitiesProvider: UtilitiesProvider,
    public platform: Platform,
    public myApp: MyApp) {
    this.mpin = this.restapiProvider.userData['mpin'].trim();
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
      let oldOtp = this.otpNum1 + this.otpNum2 + this.otpNum3 + this.otpNum4;
      if (oldOtp.length == 4 && !isNaN(parseInt(oldOtp))) {
        this.verifyMpin(oldOtp);

      }
    }
    if (this.setMPinStep == '2') {
      this.otpSetFinal = this.otpNum1 + this.otpNum2 + this.otpNum3 + this.otpNum4;
      if (this.otpSetFinal.length == 4 && !isNaN(parseInt(this.otpSetFinal))) {
        this.otpSetFinalArray = this.otpSet;
        this.setMPinStep = '3';
        this.clearSet();
      }
    }
    if (this.setMPinStep == '3') {
      this.otpConfirmFinal = this.otpNum1 + this.otpNum2 + this.otpNum3 + this.otpNum4;
      if (this.otpConfirmFinal.length == 4 && !isNaN(parseInt(this.otpConfirmFinal))) {
        if (this.otpSetFinal == this.otpConfirmFinal) {
          this.updateProfile();
        }
        else {
          $('.wrong_otp_msg').removeClass('hide');
          $('.btnOtp').addClass('wrong_otp');
        }
        // this.setMPinStep = '2';
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
            this.setMPinStep = '4';
            this.myApp.updatePageUseCount("47");
            this.utilitiesProvider.googleAnalyticsTrackView('PinChange');
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
            if (response.Data.Table[0].Status != "Failure") {
              this.setMPinStep = '2';
              this.clearSet();
            }
            else {
              $('.wrong_otp_msg').removeClass('hide');
              $('.btnOtp').addClass('wrong_otp');
            }
          }
        }, (error) => {
          this.pageLoader = false;
          $('.wrong_otp_msg').removeClass('hide');
          $('.btnOtp').addClass('wrong_otp');
        })
    }
  }
  goPatternLock() {
    this.navCtrl.push('PatternSetPage');
  }
}
