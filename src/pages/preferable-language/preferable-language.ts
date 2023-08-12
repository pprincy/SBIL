import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
import { TabsPage } from '../../pages/dashboard/tabs/tabs';
import { MyApp } from '../../app/app.component'
import { RestapiProvider } from '../../providers/restapi/restapi';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { config } from '../../shared/config';
@IonicPage()
@Component({
  selector: 'page-preferable-language',
  templateUrl: 'preferable-language.html',
})
export class PreferableLanguagePage {
  public lang: any = [];
  public langId;
  public langShort;
  public pageLoader: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private network: Network,
    public utilitiesProvider: UtilitiesProvider,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public firebaseAnalytics: FirebaseAnalytics,
    public myApp: MyApp,
    public platform: Platform, ) {
    this.langId = localStorage.getItem('langId');
    this.langShort = localStorage.getItem('lang');
  }
  ionViewDidLoad() {
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
    ]

    this.utilitiesProvider.upshotScreenView('LanguageSelection');
  }
  langClick(l) {
    this.langShort = l.short;
    this.langId = l.id;
  }
  changeLang() {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      if (this.langId) {
        localStorage.setItem("lang", this.langShort ? this.langShort : 'en');
        localStorage.setItem("langId", this.langId);
        this.myApp.setLanguage();
        setTimeout(() => {
          this.utilitiesProvider.initLangLable();
        }, 200);
        this.loadDefaultData();
      }
    }
  }
  loadDefaultData() {
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
        this.getUserProfileMaster();
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getUserProfileMaster() {
    let request = {
      "LangId": this.langId,
      'TokenId': this.restapiProvider.userData['tokenId']
    };
    return this.restapiProvider.sendRestApiRequest(request, 'GetUserProfileMaster')
      .subscribe((response) => {
        this.restapiProvider.userData['getUserProfileMaster'] = JSON.stringify(response.Data);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.utilitiesProvider.defaultData = response;

        this.getUserProfile();
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getUserProfile() {
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
          this.GetMasters();
        }
        else {
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  GetMasters() {
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
          // this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
          // if (this.platform.is('core') || this.platform.is('mobileweb')) {
          //   localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
          // }
          //this.navParams.get('data')

          if (this.navParams.get('data')) {
            setTimeout(() => {
              if (this.restapiProvider.userData['UserExistsFlag'] == 1) {
                if (this.platform.is('core') || this.platform.is('mobileweb')) {
                  localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData));
                }
                else {
                  this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
                }
                this.navCtrl.setRoot(TabsPage);
                //this.navCtrl.setRoot('QuizAgePage', { data: this.navParams.get('data') });
              }
              else {
                if (this.platform.is('core') || this.platform.is('mobileweb')) {
                  localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
                }
                else {
                  this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
                }
                this.navCtrl.setRoot('QuizAgePage', { data: this.navParams.get('data') });
              }
            }, 300);
          }
          else {
            setTimeout(() => {
              this.pageLoader = false;
              this.navCtrl.setRoot(TabsPage);
            }, 300);
          }
          localStorage.setItem("lang", this.langShort ? this.langShort : 'en');
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
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  search() {
    this.navCtrl.push('SearchPage');
  }
}
