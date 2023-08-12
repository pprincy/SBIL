import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Network } from '@ionic-native/network';
import * as $ from 'jquery';
import { Keyboard } from '@ionic-native/keyboard';
import { Diagnostic } from '@ionic-native/diagnostic';
import { MenuController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
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
    $('.app-root').addClass('hindi_font');
    if (this.platform.is('ipad')) {
      $('.input_field').addClass('ios_input');
      $('.heading_panel').addClass('ios_heading');
      $('.login_btn').addClass('ios_login_btn');
    }
    else {
      $('.input_field').removeClass('ios_input');
      $('.heading_panel').removeClass('ios_heading');
      $('.login_btn').removeClass('ios_login_btn');
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

    this.utilitiesProvider.upshotScreenView('LoginScreen');
    this.utilitiesProvider.upshotTagEvent('LoginScreen');
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
        this.errorMessage = "Please enter correct email id/mobile no.";
        // this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'])
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
      this.errorMessage = "Please enter correct email id/mobile no.";
      // this.restapiProvider.presentToastTop(this.errorMessage);
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

          this.registerUpshotLoginEvent('success', '');

          this.navCtrl.push('OtpPage', userInfo)
      //   }
      //   else {
      //     if (response.Type == "ERROR") {
      //       if (this.mobileNo) {
      //         this.navCtrl.push('UnregisteredcustomerPage', { "loginType": "Mobile" })
      //       }
      //       else {
      //         this.navCtrl.push('UnregisteredcustomerPage', { "loginType": "Email" })
      //       }
      //     }
      //     else {
      //       this.restapiProvider.presentToastTop("Please try again after sometime.")
      //     }

      //     this.registerUpshotLoginEvent('error', '');
      //   }
      // }, (error) => {
      //   this.pageLoader = false;
      // })
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

  registerUpshotLoginEvent(type, errReason) {
    let payload = {
      "Appuid": "",
      "Language": "",
      "City": "",
      "AgeGroup": "",
      "Success": type=='success'?"Yes":"No",
      "ErrorReason": errReason
    }
    this.utilitiesProvider.upshotCustomEvent('Login', payload, false);
  }
}

  // guestLogin(event) {
  //   this.loaderShow();
  //   let request = {
  //     "DeviceId": this.restapiProvider.userData['uuid'],
  //     "SimId": this.restapiProvider.userData['simSerialNumber'],
  //     "NotificationId": this.restapiProvider.userData['pushID']
  //   }
  //   console.log("Request: " + JSON.stringify(request));
  //   return this.restapiProvider.sendRestApiRequest(request, 'guestUserLogin')
  //     .subscribe((response) => {

  //       if (response.IsSuccess == true) {
  //         console.log(response);
  //         this.restapiProvider.userData['custID'] = response.Data.Table[0].CustomerID;
  //         this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
  //         this.loading.dismiss();
  //         this.navCtrl.setRoot('HomePage','Guest');
  //       }
  //       else {
  //         this.loading.dismiss();
  //         console.log(response);
  //         this.errorMessage = 'Could not register user.';
  //       }
  //     });
  // }

  // googleSignIn(event) {
  //   this.loaderShow();
  //   this.googlePlus.login({
  //     'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
  //     'webClientId': '552187125523-o74dbp1nspu1pi7ar1u2n20ud0g83vsm.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
  //     'offline': true
  //   })
  //     .then((user) => {
  //       // this.restapiProvider.userData['userID'] = user.email;
  //       this.emailID = user.email;
  //       this.mobileNo = '';
  //       this.restapiProvider.userData['emailID'] = user.email;
  //       this.restapiProvider.userData['userName'] = user.displayName
  //       this.registerUser('Google');
  //       this.restapiProvider.userData['source'] = "Google";
  //       // alert("Login Success: "+JSON.stringify(user));
  //       // console.log("Login Success: ",JSON.stringify(user));
  //     },
  //     (error) => {
  //       this.loading.dismiss();
  //       alert("Login Error: " + error);
  //     })
  // }

  // registerUser(source) {
  //   let request = {
  //     "MobileNo": this.mobileNo,
  //     "EmailId": this.emailID,
  //     "DeviceId": this.restapiProvider.userData['uuid'],
  //     "SimId": this.restapiProvider.userData['simSerialNumber'],
  //     "LoginSource": source,
  //     "NotificationId": this.restapiProvider.userData['pushID']
  //   }
  //   console.log("Request: " + JSON.stringify(request));
  //   return this.restapiProvider.sendRestApiRequest(request, 'loginReg')
  //     .subscribe((response) => {
  //       if (response.Data.Table[0].Status == 'Success') {
  //         console.log(response);
  //         this.restapiProvider.userData['custID'] = response.Data.Table[0].CustomerID;
  //         this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
  //         let page:any = this.checkAnswers(response);
  //         this.loading.dismiss();
  //         this.navCtrl.setRoot(page,'Login');
  //       }
  //       else {
  //         this.loading.dismiss();
  //         console.log(response);
  //         this.errorMessage = 'Could not register user.';
  //       }
  //     });
  // }

  // checkAnswers(data) {
  //   let age = data.Data.Table1[0].Age;
  //   let incomeGroup = data.Data.Table1[0].IncomeGroup;
  //   let maritialStatus = data.Data.Table1[0].MaritialStatus;
  //   this.restapiProvider.userData['age'] = age;
  //   this.restapiProvider.userData['incomeGroup'] = incomeGroup
  //   this.restapiProvider.userData['maritialStatus'] = maritialStatus;
  //   if (age == null || age == '' || age == undefined || isNaN(parseInt(age))) {
  //     return 'QuizAgePage';
  //   }
  //   else {
  //     this.restapiProvider.userData['age'] = age;
  //   }
  //   if ((incomeGroup    == null || incomeGroup    == '' || incomeGroup    == undefined) ||
  //       (maritialStatus == null || maritialStatus == '' || maritialStatus == undefined)) {
  //     return 'QuizLifestylePage';
  //   }
  //   else {
  //     this.restapiProvider.userData['incomeGroup'] = incomeGroup;
  //     this.restapiProvider.userData['maritialStatus'] = maritialStatus;
  //     this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
  //     return 'HomePage';
  //   }
  // }
