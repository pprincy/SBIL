import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, Platform } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';
import { UtilitiesProvider } from '../../../providers/utilities/utilities'
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { config } from '../../../shared/config';
import { MyApp } from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-forgot-mpin-otp',
  templateUrl: 'forgot-mpin-otp.html',
})
export class ForgotMpinOtpPage {
  public keyboardShow = false;
  public otpValue: any = [];
  public emailID: string = '';
  public mobileNo: string = '';
  public errorMessage: string;
  public loading: any;
  public otpNum1: any;
  public otpNum2: any;
  public otpNum3: any;
  public otpNum4: any;
  public methodName;
  public countDown = 30;
  public pageLoader: boolean = false;
  public isResndDisable: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private restapiProvider: RestapiProvider,
    private network: Network,
    public utilitiesProvider: UtilitiesProvider,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public platform: Platform,
    public firebaseAnalytics: FirebaseAnalytics,
    public myApp: MyApp) {
    let data = this.navParams.data
    if (data.isMobile) {
      this.mobileNo = data.mobile
      this.methodName = "Mobile"
    }
    if (!data.isMobile) {
      this.emailID = data.email
      this.methodName = "Email ID"
    }
  }
  ionViewDidLoad() {
    this.utilitiesProvider.googleAnalyticsTrackView('OTP Page');
    this.resendTimer();
  }
  resendOtp() {
    this.countDown = 30;
    let request = {
      'MobileNo': this.mobileNo,
      'EmailId': this.emailID,
      'CustId': this.restapiProvider.userData['TempCustomerID']
    }
    this.restapiProvider.sendRestApiRequest(request, 'sendOTP')
      .subscribe((response) => {
        if (response.IsSuccess == true) {

          this.restapiProvider.presentToastTop(this.utilitiesProvider.langJsonData['otp']['otpResendSuccessfully']);
          this.isResndDisable = true;

          this.resendTimer()
        }
        else {
        }
      })
  }
  resendTimer() {
    const setTime = setInterval(() => {
      this.countDown--;
      if (this.countDown == 0) {
        this.isResndDisable = false;
        clearInterval(setTime);
      }
    }, 1000);
  }
  inputBtnClick() {
    this.keyboardShow = true;
    $('.footer_panel').removeClass('active');
  }
  validateOTP(otp) {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.pageLoader = true;
      let request = {
        'OTP': otp,
        'MobileNo': this.mobileNo,
        'EmailId': this.emailID,
        'CustId': this.restapiProvider.userData['TempCustomerID']
      }
      this.restapiProvider.sendRestApiRequest(request, 'validateOTP').subscribe((response) => {
        if(config['isLive'] == 'No'){
          response = {"Type":"SUCCESS","IsSuccess":true,"Data":{"CustId":"9C41A3A1-7660-4371-83BF-610FF149C18A","TokenId":"A33403F6-C628-4E96-B743-FB1A9D03EDDC","UserId":"353137","SBICustomerID":"","EmailId":"","MobileNo":"9820614327","CustomerName":"Atul Tillu ","Age":"44","Gender":"","DOB":"15-08-1978","AppointeeName":"","AppointeeDOB":"","NomineeName":"","NomineeDOB":"","TempId":"880C92E3-7458-41F8-9104-DF78FBA64106","UserExistsFlag":"0"},"Message":"","StatusCode":null};
       }
        if (response.IsSuccess == true) {
          this.loadDefaultData();
          this.restapiProvider.userData['source'] = "APP";
          this.restapiProvider.userData['CustomerID'] = response.Data.CustId
          this.restapiProvider.userData['tokenId'] = response.Data.TokenId;
          this.restapiProvider.userData['emailId'] = response.Data.EmailId;
          this.restapiProvider.userData['mobileNo'] = response.Data.MobileNo;
          this.restapiProvider.userData['customerName'] = response.Data.CustomerName;
          this.restapiProvider.userData['age'] = response.Data.Age;
          this.restapiProvider.userData['dob'] = response.Data.DOB;
          this.restapiProvider.userData['occupation'] = response.Data.Occupation;
          this.restapiProvider.userData['gender'] = response.Data.Gender;
          this.restapiProvider.userData['SBICustomerID'] = response.Data.Gender;
          this.restapiProvider.userData['segmentId'] = "";
          this.restapiProvider.userData['profileImg'] = "";
          this.restapiProvider.userData['UserExistsFlag'] = response.Data.UserExistsFlag;
          this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
          this.GetMasters();
          this.storeLocation();
          this.getUserProfileMaster();
          //GA UserID Register
          if (this.platform.is('core') || this.platform.is('mobileweb')) {
          }
          else {
            if (config['isLive'] == 'Yes') {
              this.firebaseAnalytics.setUserId(response.Data.CustId).then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
          }
          setTimeout(() => {
            this.getUserProfile();
          }, 1000)
          if (this.platform.is('core') || this.platform.is('mobileweb')) {
            localStorage.setItem("isLogin", "Yes");
            localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
          }
          else {
            this.restapiProvider.userData['isLogin'] = 'Yes';
          }
          $('.wrong_otp_msg').addClass('hide');
        }
        else {
          this.errorMessage = 'OTP Request Failed!'
          this.pageLoader = false;
          $('.btnOtp').addClass('wrong_otp');
          $('.wrong_otp_msg').removeClass('hide');
          this.keyboardShow = true;
        }
      }, (error) => {
        this.pageLoader = false;
      })
    }
  }
  hideKeyboard() {
    this.keyboardShow = false;
    $('.footer_panel').addClass('active');
  }
  getUserProfile() {
    this.pageLoader = true;
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.restapiProvider.userData['profileImg'] = response.Data.Table[0].ImagePath;
          this.restapiProvider.userData['userPersonalDetails'] = JSON.stringify(response.Data);
          // this.restapiProvider.userData['LocationFlag'] =  response.Data.Table[0].LocationFlag;
          this.restapiProvider.userData['MPINFlag'] = response.Data.Table[0].MPINFlag;
          this.restapiProvider.userData['MPINTYPE'] = response.Data.Table[0].MPINTYPE;
          this.restapiProvider.userData['NotificationFlag'] = response.Data.Table[0].NotificationFlag;
          this.restapiProvider.userData['riskAssess'] = JSON.stringify(response.Data.Table7);
          this.checkLocationFlag(response.Data.Table[0].LocationFlag, 'LocationFlag');
          this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
          let params = {
            'method': this.restapiProvider.userData['mobileNo'] ? this.restapiProvider.userData['mobileNo'] : this.restapiProvider.userData['emailId']
          }
          setTimeout(() => {
            this.pageLoader = false;
            this.myApp.updatePageUseCount("2");
            this.myApp.updatePageUseCount("3");
            this.myApp.updatePageUseCount("48");
            this.utilitiesProvider.googleAnalyticsTrackView('PinForgot');
            if (this.restapiProvider.userData['UserExistsFlag'] == 1) {
              if (this.platform.is('core') || this.platform.is('mobileweb')) {
                localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData));
                localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
              }
              else {
                this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
              }
              if (this.restapiProvider.userData['MPINTYPE'] == 'mpin') {
                this.navCtrl.setRoot('MpinSetPage');
                this.myApp.updatePageUseCount("48");
                this.utilitiesProvider.googleAnalyticsTrackView('PinForgot');
              }
              else {
                this.navCtrl.setRoot('PatternSetPage');
                this.myApp.updatePageUseCount("52");
                this.utilitiesProvider.googleAnalyticsTrackView('PatternForgot');
              }
            }
            else {
              if (this.platform.is('core') || this.platform.is('mobileweb')) {
                localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
              }
              else {
                this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
              }
              if (this.restapiProvider.userData['MPINTYPE'] == 'mpin') {
                this.navCtrl.setRoot('MpinSetPage', { data: params });
                this.myApp.updatePageUseCount("48");
                this.utilitiesProvider.googleAnalyticsTrackView('PinForgot');
              }
              else {
                this.navCtrl.setRoot('PatternSetPage', { data: params })
                this.myApp.updatePageUseCount("52");
                this.utilitiesProvider.googleAnalyticsTrackView('PatternForgot');
              }
            }
          }, 500);
        }
        else {
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  checkLocationFlag(flagValue, option) {
    if (this.restapiProvider.userData['LocationFlag'] == flagValue) {
      this.restapiProvider.userData['LocationFlag'] = flagValue;
    }
    else {
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        "TokenId": this.restapiProvider.userData['tokenId'],
        "NotificationFlag": this.restapiProvider.userData['NotificationFlag'] ? 1 : 0,
        "MPINFlag": this.restapiProvider.userData['MPINFlag'] ? 1 : 0,
        "LocationFlag": this.restapiProvider.userData['LocationFlag'] ? 1 : 0,
        "SMSFlag": this.restapiProvider.userData['SMSFlag'] ? 1 : 0
      }
      return this.restapiProvider.sendRestApiRequest(request, 'UpdateUserSettingsFlag').subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table[0].MSG == "Success") {
            this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
          }
          else {
            // this.restapiProvider.presentToastTop("Could not save the settings!");
            this.restapiProvider.userData[option] = this.restapiProvider.userData[option] ? false : true;
          }
        }
        else {
          // this.restapiProvider.presentToastTop("Could not save the settings!");
          this.restapiProvider.userData[option] = this.restapiProvider.userData[option] ? false : true;
        }
      },
        (error) => {
          // this.restapiProvider.presentToastTop("Could not save the settings!");
          this.restapiProvider.userData[option] = this.restapiProvider.userData[option] ? false : true;
        })
    }
  }
  numClickFunction(n) {
    if (this.otpValue.length < 4) {
      $('.btnOtp').removeClass('wrong_otp');
      $('.wrong_otp_msg').addClass('hide');
      this.otpValue.push(n);
      for (let i = 0; i < this.otpValue.length; i++) {
        if (i == 0) {
          this.otpNum1 = this.otpValue[0];
        }
        if (i == 1) {
          this.otpNum2 = this.otpValue[1];
        }
        if (i == 2) {
          this.otpNum3 = this.otpValue[2];
        }
        if (i == 3) {
          this.otpNum4 = this.otpValue[3];
          this.keyboardShow = false;
          $('.footer_panel').addClass('active');
        }
      }
    }
  }
  numBackClick() {
    $('.btnOtp').removeClass('wrong_otp');
    $('.wrong_otp_msg').addClass('hide');
    this.otpValue.splice(-1);
    if (this.otpValue.length == 0) {
      this.otpNum1 = '';
    }
    if (this.otpValue.length == 1) {
      this.otpNum2 = '';
    }
    if (this.otpValue.length == 2) {
      this.otpNum3 = '';
    }
    if (this.otpValue.length == 3) {
      this.otpNum4 = '';
    }
  }
  submitOTP() {
    let otpValue = this.otpNum1 + this.otpNum2 + this.otpNum3 + this.otpNum4;
    if (otpValue.length == 4 && !isNaN(parseInt(otpValue))) {
      this.pageLoader = true;
      this.validateOTP(otpValue);
    }
    else {
      $('.btnOtp').addClass('wrong_otp');
      $('.wrong_otp_msg').removeClass('hide');
    }
  }

  loadDefaultData() {
    let request = {
      "data": "All"
    }
    return this.restapiProvider.sendRestApiRequest(request, 'DefaultData')
      .subscribe((response) => {
        this.restapiProvider.userData['defaultData'] = JSON.stringify(response);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.utilitiesProvider.defaultData = response;
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getUserProfileMaster() {
    return this.restapiProvider.sendRestApiRequest('', 'GetUserProfileMaster')
      .subscribe((response) => {
        this.restapiProvider.userData['getUserProfileMaster'] = JSON.stringify(response.Data);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.utilitiesProvider.defaultData = response;
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  GetMasters() {
    let request = {
      "IsCache": false
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMasters')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.restapiProvider.userData['GetMasters'] = JSON.stringify(response.Data);
          this.restapiProvider.userData['appDataMaster'] = JSON.stringify(response.Data);
          this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  storeLocation() {
    if (this.restapiProvider.userData['LocationFlag']) {
      this.geolocate();
    }
  }
  geolocate() {
    let options = {
      enableHighAccuracy: true,
      timeout: 10000
    };
    this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
      this.getcountry(position);
    }).catch((err) => {
      this.restapiProvider.userData['location'] = " ";
      this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    })
  }
  getcountry(pos) {
    this.geocoder.reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((res: NativeGeocoderReverseResult[]) => {
      this.restapiProvider.userData['location'] = res[0].locality;
      if (res[0].locality && res[0].locality != undefined && res[0].locality != null) {
        this.UpdateUserLocation(res[0].locality);
      }
      this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    }).catch((err) => {
      this.restapiProvider.userData['location'] = " ";
      this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    })
  }
  UpdateUserLocation(location) {
    let request = {
      "CustID": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "LocationName": location
    }
    this.restapiProvider.sendRestApiRequest(request, 'UpdateUserLocation').subscribe((response) => {
    },
      (error) => {
      });
  }
  // defaultData(){
  //   return this.restapiProvider.getRestApiRequest('DefaultData', 'All').subscribe((response) => {
  //     console.log("Main Data:", response);
  //     this.utilitiesProvider.defaultData = response;
  //   },(error) => {
  //   })
  // }
}

