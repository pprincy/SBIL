import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, AlertController, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Network } from '@ionic-native/network';
import * as $ from 'jquery';
import { Keyboard } from '@ionic-native/keyboard';
import { Diagnostic } from '@ionic-native/diagnostic';
import { MenuController } from 'ionic-angular';
import { UtilitiesProvider } from '../../../providers/utilities/utilities'
@IonicPage()
@Component({
  selector: 'page-forgot-mpin-login',
  templateUrl: 'forgot-mpin-login.html',
})
export class ForgotMpinLoginPage {
  public loginForm: FormGroup;
  public showPassword: boolean = false;
  public errorMessage: string;
  public isMobile: boolean = false;
  public mobileNo: string;
  public emailID: string;
  public loading: any;
  public code: string;
  public loaderObj;
  public pageLoader: boolean = false;
  public pinType;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private restapiProvider: RestapiProvider,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    private network: Network,
    private keyboard: Keyboard,
    private diagnostic: Diagnostic,
    public platform: Platform,
    public menu: MenuController,
    public utilitiesProvider: UtilitiesProvider) {

    this.loginForm = this.formBuilder.group({
      userId: ['', Validators.required],
      otp: ['', [Validators.required, Validators.pattern('[0-9]{4,4}')]]
    })
    this.restapiProvider.userData['userName'] = '';
    this.restapiProvider.userData['mpin'] = '';
  }
  ionViewDidEnter() {
    if (this.restapiProvider.userData[''] == 'mpin') {
      this.pinType = "M-PIN";
    }
    else {
      this.pinType = "M-PIN";
    }
    this.utilitiesProvider.googleAnalyticsTrackView('Login Page');
    this.menu.enable(false, 'sidemenu');
    if (!this.restapiProvider.userData['TempCustomerID'] || this.restapiProvider.userData['TempCustomerID'] == undefined || this.restapiProvider.userData['TempCustomerID'] == "") {
      if (this.diagnostic.isLocationEnabled()) {
        this.geolocate();
      }
      else {
        this.getCaptureDeviceDetails();
      }
    }
    this.keyboard.onKeyboardShow().subscribe(data => {
    });
    this.keyboard.onKeyboardHide().subscribe(data => {
    });
  }
  goBack() {
    this.errorMessage = '';
    this.showPassword = false;
    this.loginForm.reset();
  }
  submitUserID(event) {
    this.errorMessage = '';
    var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var mobileRegExp = /[0-9]{10}/;
    var finalRegExp = new RegExp(emailRegExp.source + '|' + mobileRegExp.source);
    if (finalRegExp.test(this.loginForm.get('userId').value)) {
      this.showPassword = true;
      this.errorMessage = '';
      var testMobile = new RegExp(mobileRegExp);
      this.isMobile = testMobile.test(this.loginForm.get('userId').value);
      let userInfo = this.checkMobileorEmail();
      if (this.isMobile && this.loginForm.get('userId').value.length > 12) {
        this.errorMessage = this.utilitiesProvider.langJsonData['login']['errorMsg'];
        $('.input_field_item').addClass('input-has-error');
        $('.valid_msg').removeClass('hide');
      }
      else {
        if (this.restapiProvider.userData['TempCustomerID']) {

          this.generateOTP(userInfo);
        }
        else {
          if (this.diagnostic.isLocationEnabled()) {
            this.geolocate();
          }
          else {
            this.getCaptureDeviceDetails();
          }
        }
      }
    }
    else {
      this.errorMessage = this.utilitiesProvider.langJsonData['login']['errorMsg'];
      $('.input_field_item').addClass('input-has-error');
      $('.valid_msg').removeClass('hide');
    }
  }
  changeInput(e) {
    $('.input_field_item').removeClass('input-has-error');
    $('.valid_msg').addClass('hide');
  }
  generateOTP(userInfo) {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    } else {
      this.pageLoader = true;
      let request = {
        'MobileNo': this.mobileNo,
        'EmailId': this.emailID,
        'CustId': this.restapiProvider.userData['TempCustomerID']
      }
      // this.restapiProvider.sendRestApiRequest(request, 'sendOTP').subscribe((response) => {
      //   this.pageLoader = false;
      //   if (response.IsSuccess == true) {
          this.navCtrl.push('ForgotMpinOtpPage', userInfo);
          //  this.navCtrl.push('OtpPage', userInfo)
    //     }
    //     else {
    //       if (response.Type == "ERROR") {
    //         if (this.mobileNo) {
    //           this.navCtrl.push('UnregisteredcustomerPage', { "loginType": "Mobile" })
    //         }
    //         else {
    //           this.navCtrl.push('UnregisteredcustomerPage', { "loginType": "Email" })
    //         }
    //       }
    //       else {
    //         this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseTryAgainAfterSometime'])
    //       }
    //     }
    //   }, (error) => {
    //     this.pageLoader = false;
    //   })
    }
  }
  checkMobileorEmail() {
    if (this.isMobile) {
      this.mobileNo = this.loginForm.get('userId').value;
      this.emailID = '';
      let data = {
        'mobile': this.mobileNo,
        'email': '',
        'isMobile': true
      }
      return data;
    }
    else {
      this.emailID = this.loginForm.get('userId').value;
      this.mobileNo = '';
      let data = {
        'mobile': '',
        'email': this.emailID,
        'isMobile': false
      }
      return data;
    }
  }
  geolocate() {
    let options = {
      enableHighAccuracy: true,
      timeout: 10000
    };
    this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
      this.restapiProvider.userData['LocationFlag'] = true;
      this.getcountry(position);
    }).catch((err) => {
      this.restapiProvider.userData['location'] = " ";
      this.restapiProvider.userData['LocationFlag'] = false;
      this.getCaptureDeviceDetails()
    })
  }
  getcountry(pos) {
    this.geocoder.reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((res: NativeGeocoderReverseResult[]) => {
      this.restapiProvider.userData['location'] = res[0].locality;
      this.getCaptureDeviceDetails()
    }).catch((err) => {
      this.restapiProvider.userData['location'] = " ";
      this.getCaptureDeviceDetails()
    })
  }
  getCaptureDeviceDetails() {
    let request = {};
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      request = {
        "DeviceId": "e5c712a69142c1b7",
        "SimId": "89918741200014691510",
        "LocationName": "Mumbai",
        "NotificationId": "",
      }
    } else {
      request = {
        "DeviceId": this.restapiProvider.userData['uuid'] == null ? ' ' : this.restapiProvider.userData['uuid'],
        "SimId": this.restapiProvider.userData['simSerialNumber'] == null ? ' ' : this.restapiProvider.userData['simSerialNumber'],
        "LocationName": this.restapiProvider.userData['location'],
        "NotificationId": this.restapiProvider.userData['pushID'] == null ? ' ' : this.restapiProvider.userData['pushID'],
      }
    }
    if (this.restapiProvider.userData['pushID']) {
      this.restapiProvider.userData['isNotificationRegister'] = "Yes";
    }
    this.restapiProvider.sendRestApiRequest(request, 'captureDeviceDetails').subscribe((response) => {
      if (response.IsSuccess == true) {
        this.restapiProvider.userData['TempCustomerID'] = response.Data.Table[0].TempCustomerID;
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
      }
      else {
      }
    })
  }
}
