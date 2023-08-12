import { Component } from '@angular/core';
import { IonicPage, Modal, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { config } from '../../shared/config';
import { MyApp } from '../../app/app.component';
import { SelectLanguagePage } from '../../components/modals/select-language/select-language';
import { TabsPage } from '../dashboard/tabs/tabs';
declare var cordova: any;
declare var upshot: any;
@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
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
    private restapiProvider: RestapiProvider,
    private network: Network,
    public utilitiesProvider: UtilitiesProvider,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public platform: Platform,
    public firebaseAnalytics: FirebaseAnalytics,
    public myApp: MyApp,
    public modalCtrl: ModalController) {
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
    this.utilitiesProvider.upshotScreenView('OTPScreen');
    this.utilitiesProvider.googleAnalyticsTrackView('OTP Page');
    this.resendTimer();
  }

  ionViewDidEnter() {
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
          localStorage.removeItem('tokenExpired');
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
          debugger;
          this.restapiProvider.userData['MPINFlag'] = response.Data.Table[0].MPINFlag;
          this.restapiProvider.userData['MPINTYPE'] = response.Data.Table[0].MPINTYPE;
          this.restapiProvider.userData['NotificationFlag'] = response.Data.Table[0].NotificationFlag;
          this.restapiProvider.userData['SMSFlag'] = response.Data.Table[0].SMSFlag;
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
            if (this.restapiProvider.userData['UserExistsFlag'] == 1) {
              if (this.platform.is('core') || this.platform.is('mobileweb')) {
                localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData));
                localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
              }
              else {
                this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
              }
              // this.navCtrl.setRoot(TabsPage);
              // this.navCtrl.push('PreferableLanguagePage', { data: params });
              //PreferableLanguagePage
              this.showlanguageModal();
            }
            else {
              if (this.platform.is('core') || this.platform.is('mobileweb')) {
                localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
              }
              else {
                this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
              }
              // this.navCtrl.push('PreferableLanguagePage', { data: params });
              //PreferableLanguagePage
              this.showlanguageModal();
            }
          }, 500);

          this.updateUphotUserProfile();
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
      "data": "All",
      "LangId": localStorage.getItem('langId'),
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'DefaultData')
      .subscribe((response) => {
        if(config['isLive'] == 'No'){
           response = {"Item1":{"calculators":{"networth":{"data":{"assets":[{"id":"1","value":"Cash In hand","amount":""},{"id":"2","value":"PF/PPF","amount":""},{"id":"3","value":"PF/RD","amount":""},{"id":"4","value":"Gold","amount":""},{"id":"5","value":"Property other than one living in","amount":""},{"id":"6","value":"MF - Equity","amount":""},{"id":"7","value":"MF- Debt","amount":""},{"id":"8","value":"Protection/Term plan","amount":""},{"id":"9","value":"Sukanya","amount":""},{"id":"10","value":"NSC/KVP","amount":""},{"id":"11","value":"NPS","amount":""},{"id":"12","value":"Direct Equity","amount":""},{"id":"13","value":"Bond","amount":""},{"id":"14","value":"Child Plan","amount":""},{"id":"15","value":"Pension Plan","amount":""},{"id":"16","value":"Health Insurance","amount":""},{"id":"17","value":"Endowment Plan","amount":""},{"id":"18","value":"Unit linked policy","amount":""},{"id":"19","value":"Arbitrage Funds","amount":""},{"id":"20","value":"RBI Bonds","amount":""},{"id":"21","value":"Index Funds","amount":""},{"id":"22","value":"Others","amount":""}],"liabilities":[{"id":"1","value":"Vehicle Loan","amount":""},{"id":"2","value":"Home Loan","amount":""},{"id":"3","value":"Personal Loan","amount":""},{"id":"4","value":"Credit Card Debt","amount":""},{"id":"5","value":"Education Loan","amount":""},{"id":"6","value":"Agriculture/ Business Loan","amount":""},{"id":"7","value":"Others","amount":""}]},"sliderConfig":{"assets":{"min":"0","max":"100000000","steps":"100"},"liabilities":{"min":"0","max":"100000000","steps":"100"}}},"sukanyasamriddhi":{"data":{"investmentamount_pm":{"min":"250","max":"12500","default":""},"rateofinterest":{"min":"","max":"","default":"8.1"},"investmentperiod":{"min":"","max":"","default":"14"},"maturityperiod":{"min":"14","max":"21","default":"21"}},"sliderConfig":{"age_of_child":{"min":"1","max":"10","steps":"1"}}},"ppf":{"data":{"tenure_prev_inv":{"min":"1","max":"15","default":"1"},"amount":{"min":"500","max":"150000","default":"500"},"existamount":{"min":"0","max":"5000000","default":"0"},"tenure_in_yr":{"min":"15","max":"30","default":"15"},"rateofreturn":{"min":"","max":"","default":"7.1"}}},"epf":{"data":{"current_age":{"min":"18","max":"57","default":"18"},"retirement_age":{"min":"25","max":"58","default":"25"},"basic_pay_increment_rate":{"min":"0","max":"30","default":"5"},"rateofinterest":{"min":"5","max":"15","default":"8.75"},"own_contribution_perc":{"min":"10","max":"12","default":"12"},"company_contribution_perc":{"min":"3.76","max":"12","default":"3.76"}}},"nps":{"data":{"rateofinterest":{"min":"4.0","max":"12.0","default":"8.0"},"percpensionreinvestedinannuity":{"min":"40.0","max":"100.0","default":"40.0"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}},"sliderConfig":{"current_age":{"min":"18","max":"65","steps":"1"},"retirement_age":{"min":"18","max":"70","steps":"1"},"monthly_contri_pa":{"min":"500","max":"83334"}}},"loaneligibility":{"data":{"amount_reqd":{"min":"10000","max":"400000","default":"10000"},"interest_rate":{"min":"4","max":"14","default":""},"tenure_in_yr":{"min":"3","max":"30","default":""}}},"target":{"data":{"target_amt":{"min":"20000","max":"100000000","default":""},"duration_in_yr":{"min":"1","max":"50","default":""},"rate_of_return":{"min":"6","max":"12","default":""},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"12","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"emi":{"data":{"amt":{"min":"100000","max":"20000000","default":"100000"},"tenure_in_yr":{"min":"1","max":"30","default":""},"interest_rate":{"min":"4","max":"40","default":""}}},"fd":{"data":{"amt":{"min":"10000","max":"5000000","default":"10000"},"tenure_in_yr":{"min":"1","max":"10","default":""},"interest_rate":{"min":"5","max":"9","default":""},"interest_rate_frequency":["Monthly","Quarterly","Half Yearly","Yearly"]}},"sip":{"data":{"mnthly_inv":{"min":"500","max":"100000","default":"500"},"tenure_in_yr":{"min":"1","max":"40","deafult":""},"rate_of_return":{"min":"6","max":"12","default":"8"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"magic_of_compounding":{"data":{"mnthly_inv":{"min":"1000","max":"100000","default":"1000"},"tenure_in_yr":{"min":"1","max":"40","deafult":""},"rate_of_return":{"min":"6","max":"12","default":"8"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"smokingless":{"data":{"no_of_ciggarettes_per_day":{"min":"1","max":"40","default":"5"},"cost_per_ciggarette":{"min":"5","max":"20","deafult":"10"},"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"years_ive_been_smoking":{"min":"1","max":"40","default":"1"},"tar_per_cig":{"min":"","max":"","default":"0.007"},"saving_growth_rate":{"min":"","max":"","default":"8"},"reduction_in_life_per_cig_minutes":{"min":"","max":"","default":"11"}}},"crorepati":{"data":{"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"i_want_be_a_crorepati_in":{"min":"1","max":"30","deafult":"1"},"you_have_already_saved":{"min":"0","max":"","default":""},"increasing_savings_rate":{"min":"0","max":"10","default":"5"},"amount":{"min":"0","max":"10000000","default":"0"},"growth_rate_of_lumpsum":{"min":"","max":"","default":"6"},"rate_of_increment_yearly":{"min":"0","max":"10","default":"5"}}},"eatingout":{"outings_per_month":{"min":"1","max":"20","default":"8"},"avg_cost_per_outings":{"min":"500","max":"10000","default":"1000"},"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"reduction_in_outing":{"min":"1","max":"","default":""},"duration":{"default":"5"}}}},"Item2":{"goals":{"target":{"data":{"amount_reqd":{"min":"100000","max":"3000000","default":"100000"},"duration_in_yr":{"min":"1","max":"50","default":"1"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"car":{"data":{"cost":{"min":"100000","max":"3000000","default":{"type":[{"name":"Hatch Back","cost":"500000","imagepath":"/Images/App/HatchBack.png"},{"name":"Sedan","cost":"800000","imagepath":"/Images/App/Sedan.png"},{"name":"SUV","cost":"1200000","imagepath":"/Images/App/SUV.png"},{"name":"Luxury","cost":"2500000","imagepath":"/Images/App/Luxury.png"}]}},"duration_in_yr":{"min":"1","max":"10","default":"1"},"downpayment_perc":{"min":"10","max":"100","default":"100"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"emi_int_rate":{"min":"5","max":"15","default":"5"},"loan_duration_yr":{"min":"1","max":"7","default":"1"},"lumpsum_compound":{"default":"6"}}},"home":{"data":{"cost":{"min":"1000000","max":"30000000","default":"1000000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"downpayment_perc":{"min":"10","max":"100","default":"20"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"emi_int_rate":{"min":"5","max":"15","default":"5"},"loan_duration_yr":{"min":"1","max":"30","default":"20"},"lumpsum_compound":{"default":"6"},"risk_profile":{"default":"moderate investor"}}},"education":{"data":{"cost":{"min":"100000","max":"17000000","default":"100000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"lumpsum_avlbl":{"min":"0","max":"30000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"wedding":{"data":{"cost":{"min":"100000","max":"5000000","default":"100000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"lumpsum_avlbl":{"min":"0","max":"50000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"retirement":{"data":{"current_age":{"min":"18","max":"69","default":"18"},"retirement_age":{"min":"19","max":"70","default":"19"},"curr_mnthly_exp":{"min":"5000","max":"500000","default":"5000"},"lumpsum_avlbl":{"min":"0","max":"20000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"insurance":{"data":{"inflation_rate":{"min":"2","max":"6","default":"5.5"}}},"family_protection":{"data":{"current_age":{"min":"20","max":"60","default":"20"},"retirement_age":{"min":"45","max":"65","default":"45"},"monthly_income":{"min":"5000","max":"500000","default":"5000"},"existing_cover":{"min":"0","max":"","default":"0"},"monthly_expense":{"min":"5000","max":"500000","default":"5000"},"inflation_rate":{"min":"","max":"","default":"6"}}}}}};
        }
       
        this.restapiProvider.userData['defaultData'] = JSON.stringify(response);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.utilitiesProvider.defaultData = response;
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getUserProfileMaster() {
    let request = {
      "LangId": localStorage.getItem('langId'),
      'TokenId': this.restapiProvider.userData['tokenId']
    };
    return this.restapiProvider.sendRestApiRequest(request, 'GetUserProfileMaster')
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
      "IsCache": false,
      "LangId": localStorage.getItem('langId'),
      'TokenId': this.restapiProvider.userData['tokenId']
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


  /**Update Upshot Profile added 07-12-2020 */
  updateUphotUserProfile() {
    try {
      console.log('updateUphotUserProfile()')

      let request = {
        "LangId": "1",
        'TokenId': this.restapiProvider.userData['tokenId'],
      };
      return this.restapiProvider.sendRestApiRequest(request, 'GetUserProfileMaster')
        .subscribe((response) => {
          if (response.IsSuccess == true) {
            this.utilitiesProvider.userProfileDetailEn = response.Data;
            let personalDetails = JSON.parse(this.restapiProvider.userData["userPersonalDetails"]);
            var req = {
              "appuid": this.restapiProvider.userData['CustomerID'],
              // "userName": this.restapiProvider.userData['customerName'],
              // "language": localStorage.getItem("langId") == "2" ? "Hindi" : "English",
              // "phone": this.restapiProvider.userData['mobileNo'] || '',
              // "email": this.restapiProvider.userData['emailId'] || '',
              // "qualification": personalDetails.Table[0]['EducationName'] || '',
              // "occupation": personalDetails.Table[0]['OccupationName'] || '',
              // "age": Number(personalDetails.Table[0]['Age']) || 0,
              // "gender": this.utilitiesProvider.getUpshotGenderFormat(this.restapiProvider.userData['gender']),
              // "maritalStatus": this.utilitiesProvider.getUpshotMaritalFormat(personalDetails.Table[0]['MaritialStatus']),
              // "dob": this.utilitiesProvider.getUpshotDOBFormat(this.restapiProvider.userData['dob']),
              // "localeCode": localStorage.getItem("langId") == "2" ? "hi_IN" : "en_US",
              "others": {
                // "profileCompletion": personalDetails.Table[0]['ProfileScore'],
                // "livingIn": personalDetails.Table[0]['CityOfResidence'],
                "lifeStage": personalDetails.Table[0]['MaritialStatus'],
                // "familyMemberCount": personalDetails.Table1.length,
                // "industry": personalDetails.Table[0]['Industry'],
                // "designation": personalDetails.Table[0]['DesignationName'],
                // "workExperience": personalDetails.Table[0]['Experiance'],
                "incomeRange": personalDetails.Table[0]['IncomeGroup'],
                "riskAssessmentResult": personalDetails.Table[0]['Risk_AssestMent_Output'],
                // "lumpsumSavings": personalDetails.Table[0]['LumpSum'],
                // "emergencyFunds": personalDetails.Table[0]['EmergencyFunds'],
                // "assetsValueTotal": personalDetails.Table[0]['Asset_value'],
                // "monthlyExpensesTotal": personalDetails.Table[0]['MontlyExpense'],
                // "estimatedTotalLiabilities": personalDetails.Table[0]['Liabilites'],
                // "ancestorProperty": personalDetails.Table[0]['AncestorProperty'],
                "preferredInvestment": this.utilitiesProvider.getPreferenceList(personalDetails.Table5),
                // "hobbies": this.utilitiesProvider.getHobbiesList(personalDetails.Table6),
                // "city": personalDetails.Table[0]['CityOfResidence'],
                "ageGroup": this.utilitiesProvider.getAgeGroup(Number(personalDetails.Table[0]['Age'])),
                // "motherTongue": personalDetails.Table[0]['MotherTongue']
              }
            }

            // req = this.utilitiesProvider.setFamilyMemberDetails(req, personalDetails);
            // req = this.utilitiesProvider.setBreakupDetails(req, personalDetails);

            // if (!req.email) { // remove email property if not available
            //   delete req.email;
            // }

            // if (!req.phone) { // remove phone property in case not available
            //   delete req.phone;
            // }

            // if (req.phone) { // adding country code if not present (required in upshot)
            //   if (req.phone.indexOf('+') == -1) {
            //     req.phone = "+91" + req.phone;
            //   }
            // }

            console.log("UPSHOT PROFILE REQUEST:: >>>", req)

            cordova.plugins.UpshotPlugin.updateUserProfile(req);
          }
        },
          (error) => {
            // this.pageLoader = false;
          })
    }
    catch (err) {
      console.log(err)
    }
  }

  public modal: Modal;
  async showlanguageModal() {
    this.modal = this.modalCtrl.create(
      SelectLanguagePage,
      { allowDismiss: false },
      {
        showBackdrop: true,
        enableBackdropDismiss: false,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss((langId)=>{
      if(langId != null 
        && langId != "" 
        && langId != localStorage.getItem("langId")) {
        this.changeLanguage(langId);
      } else {
        this.changeLanguage("1");
      }
    });
  }

  public langId: string = "1";
  changeLanguage(langId: string) {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    } else {
      if (langId) {
        localStorage.setItem("lang", langId == "2" ? 'hi' : 'en');
        localStorage.setItem("langId", langId);
        this.myApp.setLanguage();
        setTimeout(() => {
          this.utilitiesProvider.initLangLable();
        }, 200);
        this.langId = langId;
        this.loadDefaultDataAfterSelectLang();
      }
    }
  }

  loadDefaultDataAfterSelectLang() {
    this.pageLoader = true;
    let request = {
      "data": "All",
      "LangId": this.langId,
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'DefaultData')
      .subscribe((response) => {
        if(config['isLive'] == 'No'){
          response = {"Item1":{"calculators":{"networth":{"data":{"assets":[{"id":"1","value":"Cash In hand","amount":""},{"id":"2","value":"PF/PPF","amount":""},{"id":"3","value":"PF/RD","amount":""},{"id":"4","value":"Gold","amount":""},{"id":"5","value":"Property other than one living in","amount":""},{"id":"6","value":"MF - Equity","amount":""},{"id":"7","value":"MF- Debt","amount":""},{"id":"8","value":"Protection/Term plan","amount":""},{"id":"9","value":"Sukanya","amount":""},{"id":"10","value":"NSC/KVP","amount":""},{"id":"11","value":"NPS","amount":""},{"id":"12","value":"Direct Equity","amount":""},{"id":"13","value":"Bond","amount":""},{"id":"14","value":"Child Plan","amount":""},{"id":"15","value":"Pension Plan","amount":""},{"id":"16","value":"Health Insurance","amount":""},{"id":"17","value":"Endowment Plan","amount":""},{"id":"18","value":"Unit linked policy","amount":""},{"id":"19","value":"Arbitrage Funds","amount":""},{"id":"20","value":"RBI Bonds","amount":""},{"id":"21","value":"Index Funds","amount":""},{"id":"22","value":"Others","amount":""}],"liabilities":[{"id":"1","value":"Vehicle Loan","amount":""},{"id":"2","value":"Home Loan","amount":""},{"id":"3","value":"Personal Loan","amount":""},{"id":"4","value":"Credit Card Debt","amount":""},{"id":"5","value":"Education Loan","amount":""},{"id":"6","value":"Agriculture/ Business Loan","amount":""},{"id":"7","value":"Others","amount":""}]},"sliderConfig":{"assets":{"min":"0","max":"100000000","steps":"100"},"liabilities":{"min":"0","max":"100000000","steps":"100"}}},"sukanyasamriddhi":{"data":{"investmentamount_pm":{"min":"250","max":"12500","default":""},"rateofinterest":{"min":"","max":"","default":"8.1"},"investmentperiod":{"min":"","max":"","default":"14"},"maturityperiod":{"min":"14","max":"21","default":"21"}},"sliderConfig":{"age_of_child":{"min":"1","max":"10","steps":"1"}}},"ppf":{"data":{"tenure_prev_inv":{"min":"1","max":"15","default":"1"},"amount":{"min":"500","max":"150000","default":"500"},"existamount":{"min":"0","max":"5000000","default":"0"},"tenure_in_yr":{"min":"15","max":"30","default":"15"},"rateofreturn":{"min":"","max":"","default":"7.1"}}},"epf":{"data":{"current_age":{"min":"18","max":"57","default":"18"},"retirement_age":{"min":"25","max":"58","default":"25"},"basic_pay_increment_rate":{"min":"0","max":"30","default":"5"},"rateofinterest":{"min":"5","max":"15","default":"8.75"},"own_contribution_perc":{"min":"10","max":"12","default":"12"},"company_contribution_perc":{"min":"3.76","max":"12","default":"3.76"}}},"nps":{"data":{"rateofinterest":{"min":"4.0","max":"12.0","default":"8.0"},"percpensionreinvestedinannuity":{"min":"40.0","max":"100.0","default":"40.0"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}},"sliderConfig":{"current_age":{"min":"18","max":"65","steps":"1"},"retirement_age":{"min":"18","max":"70","steps":"1"},"monthly_contri_pa":{"min":"500","max":"83334"}}},"loaneligibility":{"data":{"amount_reqd":{"min":"10000","max":"400000","default":"10000"},"interest_rate":{"min":"4","max":"14","default":""},"tenure_in_yr":{"min":"3","max":"30","default":""}}},"target":{"data":{"target_amt":{"min":"20000","max":"100000000","default":""},"duration_in_yr":{"min":"1","max":"50","default":""},"rate_of_return":{"min":"6","max":"12","default":""},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"12","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"emi":{"data":{"amt":{"min":"100000","max":"20000000","default":"100000"},"tenure_in_yr":{"min":"1","max":"30","default":""},"interest_rate":{"min":"4","max":"40","default":""}}},"fd":{"data":{"amt":{"min":"10000","max":"5000000","default":"10000"},"tenure_in_yr":{"min":"1","max":"10","default":""},"interest_rate":{"min":"5","max":"9","default":""},"interest_rate_frequency":["Monthly","Quarterly","Half Yearly","Yearly"]}},"sip":{"data":{"mnthly_inv":{"min":"500","max":"100000","default":"500"},"tenure_in_yr":{"min":"1","max":"40","deafult":""},"rate_of_return":{"min":"6","max":"12","default":"8"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"magic_of_compounding":{"data":{"mnthly_inv":{"min":"1000","max":"100000","default":"1000"},"tenure_in_yr":{"min":"1","max":"40","deafult":""},"rate_of_return":{"min":"6","max":"12","default":"8"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"smokingless":{"data":{"no_of_ciggarettes_per_day":{"min":"1","max":"40","default":"5"},"cost_per_ciggarette":{"min":"5","max":"20","deafult":"10"},"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"years_ive_been_smoking":{"min":"1","max":"40","default":"1"},"tar_per_cig":{"min":"","max":"","default":"0.007"},"saving_growth_rate":{"min":"","max":"","default":"8"},"reduction_in_life_per_cig_minutes":{"min":"","max":"","default":"11"}}},"crorepati":{"data":{"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"i_want_be_a_crorepati_in":{"min":"1","max":"30","deafult":"1"},"you_have_already_saved":{"min":"0","max":"","default":""},"increasing_savings_rate":{"min":"0","max":"10","default":"5"},"amount":{"min":"0","max":"10000000","default":"0"},"growth_rate_of_lumpsum":{"min":"","max":"","default":"6"},"rate_of_increment_yearly":{"min":"0","max":"10","default":"5"}}},"eatingout":{"outings_per_month":{"min":"1","max":"20","default":"8"},"avg_cost_per_outings":{"min":"500","max":"10000","default":"1000"},"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"reduction_in_outing":{"min":"1","max":"","default":""},"duration":{"default":"5"}}}},"Item2":{"goals":{"target":{"data":{"amount_reqd":{"min":"100000","max":"3000000","default":"100000"},"duration_in_yr":{"min":"1","max":"50","default":"1"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"car":{"data":{"cost":{"min":"100000","max":"3000000","default":{"type":[{"name":"Hatch Back","cost":"500000","imagepath":"/Images/App/HatchBack.png"},{"name":"Sedan","cost":"800000","imagepath":"/Images/App/Sedan.png"},{"name":"SUV","cost":"1200000","imagepath":"/Images/App/SUV.png"},{"name":"Luxury","cost":"2500000","imagepath":"/Images/App/Luxury.png"}]}},"duration_in_yr":{"min":"1","max":"10","default":"1"},"downpayment_perc":{"min":"10","max":"100","default":"100"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"emi_int_rate":{"min":"5","max":"15","default":"5"},"loan_duration_yr":{"min":"1","max":"7","default":"1"},"lumpsum_compound":{"default":"6"}}},"home":{"data":{"cost":{"min":"1000000","max":"30000000","default":"1000000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"downpayment_perc":{"min":"10","max":"100","default":"20"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"emi_int_rate":{"min":"5","max":"15","default":"5"},"loan_duration_yr":{"min":"1","max":"30","default":"20"},"lumpsum_compound":{"default":"6"},"risk_profile":{"default":"moderate investor"}}},"education":{"data":{"cost":{"min":"100000","max":"17000000","default":"100000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"lumpsum_avlbl":{"min":"0","max":"30000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"wedding":{"data":{"cost":{"min":"100000","max":"5000000","default":"100000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"lumpsum_avlbl":{"min":"0","max":"50000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"retirement":{"data":{"current_age":{"min":"18","max":"69","default":"18"},"retirement_age":{"min":"19","max":"70","default":"19"},"curr_mnthly_exp":{"min":"5000","max":"500000","default":"5000"},"lumpsum_avlbl":{"min":"0","max":"20000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"insurance":{"data":{"inflation_rate":{"min":"2","max":"6","default":"5.5"}}},"family_protection":{"data":{"current_age":{"min":"20","max":"60","default":"20"},"retirement_age":{"min":"45","max":"65","default":"45"},"monthly_income":{"min":"5000","max":"500000","default":"5000"},"existing_cover":{"min":"0","max":"","default":"0"},"monthly_expense":{"min":"5000","max":"500000","default":"5000"},"inflation_rate":{"min":"","max":"","default":"6"}}}}}};
        }
        
        this.restapiProvider.userData['defaultData'] = JSON.stringify(response);
        this.utilitiesProvider.defaultData = response;
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.getUserProfileMasterAfterSelectLang();
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  getUserProfileMasterAfterSelectLang() {
    let request = {
      "LangId": this.langId,
      'TokenId': this.restapiProvider.userData['tokenId']
    };
    return this.restapiProvider.sendRestApiRequest(request, 'GetUserProfileMaster')
      .subscribe((response) => {
        this.restapiProvider.userData['getUserProfileMaster'] = JSON.stringify(response.Data);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.utilitiesProvider.defaultData = response;

        this.getUserProfileAfterSelectLang();
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  getUserProfileAfterSelectLang() {
    this.pageLoader = true;
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "LangId": this.langId
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails')

      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.restapiProvider.userData['profileImg'] = response.Data.Table[0].ImagePath;
          this.restapiProvider.userData['userPersonalDetails'] = JSON.stringify(response.Data);
          this.restapiProvider.userData['MPINFlag'] = response.Data.Table[0].MPINFlag;
          this.restapiProvider.userData['MPINTYPE'] = response.Data.Table[0].MPINTYPE;
          this.restapiProvider.userData['NotificationFlag'] = response.Data.Table[0].NotificationFlag;
          this.restapiProvider.userData['SMSFlag'] = response.Data.Table[0].SMSFlag;
          this.restapiProvider.userData['riskAssess'] = JSON.stringify(response.Data.Table7);
          this.GetMastersAfterSelectLang();
        }
        else {
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  GetMastersAfterSelectLang() {
    let request = {
      "IsCache": false,
      "LangId": this.langId,
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMasters')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.restapiProvider.userData['GetMasters'] = JSON.stringify(response.Data);
          this.restapiProvider.userData['appDataMaster'] = JSON.stringify(response.Data);
          
          let params = {
            'method': this.restapiProvider.userData['mobileNo'] ? this.restapiProvider.userData['mobileNo'] : this.restapiProvider.userData['emailId']
          }
          if (params) {
            setTimeout(() => {
              if (this.restapiProvider.userData['UserExistsFlag'] == 1) {
                if (this.platform.is('core') || this.platform.is('mobileweb')) {
                  localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData));
                }
                else {
                  this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
                }
                this.navCtrl.setRoot(TabsPage);
              }
              else {
                if (this.platform.is('core') || this.platform.is('mobileweb')) {
                  localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
                }
                else {
                  this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
                }
                this.navCtrl.setRoot('QuizAgePage', { data: params });
              }
            }, 300);
          }
          else {
            setTimeout(() => {
              this.pageLoader = false;
              this.navCtrl.setRoot(TabsPage);
            }, 300);
          }
          localStorage.setItem("lang", this.langId == "2" ? 'hi' : 'en');
          localStorage.setItem("langId", this.langId);
          this.myApp.setLanguage();
          setTimeout(() => {
            this.utilitiesProvider.initLangLable();
          }, 200);

          // setTimeout(() => {
          this.utilitiesProvider.upshotUserData.lang = (localStorage.getItem("langId") == "2" ? "Hindi" : "English") || '';
            this.myApp.updateUphotUserProfile();
          // }, 200);
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
}

