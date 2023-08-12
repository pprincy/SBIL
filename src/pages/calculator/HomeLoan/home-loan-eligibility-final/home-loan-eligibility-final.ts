import { Component,
         ViewChild,
         Input            } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams,
         Content,
         LoadingController,
         MenuController    } from 'ionic-angular';
import { RestapiProvider   } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import {MyApp} from '../../../../app/app.component';
@IonicPage()
@Component({
  selector    : 'page-home-loan-eligibility-final',
  templateUrl : 'home-loan-eligibility-final.html',
})
export class HomeLoanEligibilityFinalPage {

  @ViewChild(Content) content: Content;
  public selectedDrop       : string;
  public isBtnActive        :boolean = false;
  public status             :boolean = false;
  public smallSteps         : number = 1;
  public bigSteps           : number = 5000;
  public eligibleLoanAmount : number = 0;
  public EMIPerMonth        : number = 0;
  public interestPayable    : number = 0;
  public payableAmount      : number = 0;
  public interestRate       : number = 0;
  public monthlyIncome      : number = 0;
  public age                : number = 0;
  public tenure             : number = 0;
  public rangeDataUi        : any = {};
  public pageLoader         : boolean = false;
  public config             : any;
  public networthValue      : any;
  public loading            : any;
  public disclaimer : any = false;
  constructor(public navCtrl           : NavController, 
              public navParams         : NavParams,
              public utilitiesProvider : UtilitiesProvider, 
              private restapiProvider  : RestapiProvider,
              private loadingCtrl      : LoadingController,
              public menuCtrl          : MenuController,
              public myApp : MyApp ) {
    this.eligibleLoanAmount = parseFloat(this.navParams.get("data").EligibleLoanAmount)
    this.EMIPerMonth        = parseFloat(this.navParams.get("data").EMI)
    this.interestPayable    = parseFloat(this.navParams.get("data").InterestPayable)
    this.payableAmount      = parseFloat(this.navParams.get("data").TotalAmtPayOverTenure)
    this.interestRate       = parseFloat(this.navParams.get("data").InterestRate)
    this.monthlyIncome      = parseFloat(this.navParams.get("data").MonthlyIncome)
    this.age                = parseInt(this.navParams.get("data").Age)
    this.tenure             = parseInt(this.navParams.get("data").TenureInYrs)
  }

  disclaimerInfo(){
    this.disclaimer = !this.disclaimer;
    if(this.disclaimer == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  disclaimerClose(){
    this.disclaimer = !this.disclaimer;
  
    if(this.disclaimer == false)
    {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  // top = 0;
  // scrollToTop() {
  //   setTimeout(() => {
  //     this.cssCahnge();
  //   }, 100);
  // }

  // cssCahnge() {
  //   if (this.top == 0) {
  //     $('.networth_details').removeClass('shrink');
  //   }
  //   else {
  //     $('.networth_details').addClass('shrink');
  //     setTimeout(function () {
  //       var hedaerheight = $('.shrink').parent().outerHeight();
  //     }, 100);
  //   }
  // }
  
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("17");
    this.utilitiesProvider.googleAnalyticsTrackView('Home Loan Eligibility');
  // this.scrollToTop();
  // this.content.ionScroll.subscribe((data)=>{
  //   if(data){
  //     this.top  = data.scrollTop;
  //     this.cssCahnge();
  //   }
  //  });
    
  // this.content.ionScrollStart.subscribe((data)=>{
  //   if(data){
  //     this.top  = data.scrollTop;
  //     this.cssCahnge();
  //   }
  // });

  this.utilitiesProvider.upshotScreenView('HomeLoanEligibilityFinal');
}

menuToggle(){
  this.menuCtrl.open();
}

toggleClass(id){
  $('#' + id).toggleClass('active')
}
showOverlay(type){
  this.status = !this.status;
  $('.header').addClass('headerOverlay');
  $('.scroll-content').addClass('scrollOverlay');
  this.selectedDrop = type;
  if(type  == "interestRate"){
    this.utilitiesProvider.rangeData = this.interestRate;
      this.rangeDataUi = {
          "steps"  : this.smallSteps,
          "amount" : this.interestRate,
          "min"    : parseFloat(this.utilitiesProvider.defaultGoalData.data.interest_rate.min),
          "max"    : parseFloat(this.utilitiesProvider.defaultGoalData.data.interest_rate.max),
          "title"  : this.utilitiesProvider.langJsonData['emiCalculator']['interestRate'],
          "type"  : "" ,
          "info"  : this.utilitiesProvider.infoPopupText[5].desc
        }
  }
  if(type  == "monthlyIncome"){
    this.utilitiesProvider.rangeData = this.monthlyIncome;
    this.rangeDataUi = {
        "steps"  : this.bigSteps,
        "amount" : this.monthlyIncome,
        "min"    : parseFloat(this.utilitiesProvider.defaultGoalData.data.amount_reqd.min),
        "max"    : parseFloat(this.utilitiesProvider.defaultGoalData.data.amount_reqd.max),
        "title"  : this.utilitiesProvider.langJsonData['homeLoanEligibility']['monthlyIncome'],
        "type"  : "r" ,
        "info"  : ""
      }
  }
  if(type  == "age"){
    this.utilitiesProvider.rangeData = this.age;
    this.rangeDataUi = {
        "steps"  : this.smallSteps,
        "amount" : this.age,
        "min"    : this.utilitiesProvider.age18[0],
        "max"    : this.utilitiesProvider.age18[this.utilitiesProvider.age18.length - 1],
        "title"  : this.utilitiesProvider.commonLangMsg['age'],
        "type"  : "" ,
        "info"  : ""
      }
  }
  if(type  == "tenure"){
    this.utilitiesProvider.rangeData = this.tenure;
    this.rangeDataUi = {
        "steps"  : this.smallSteps,
        "amount" : this.tenure,
        "min"    : parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.min),
        "max"    : parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.max),
        "title" : this.utilitiesProvider.langJsonData['homeLoanEligibility']['tenure'],
        "type"  : "" ,
        "info"  : ""
      }
  }
  
}
  done(){
    let rangeValue = parseFloat(this.utilitiesProvider.rangeData);
    if(rangeValue){
      if (rangeValue < parseFloat(this.rangeDataUi.min) || rangeValue > parseFloat(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
        $('.header').removeClass('headerOverlay');
        $('.scroll-content').removeClass('scrollOverlay');
        if (this.selectedDrop == "interestRate") {
          this.interestRate = rangeValue;
        }
        if (this.selectedDrop == "monthlyIncome") {
          this.monthlyIncome = rangeValue;
        }
        if (this.selectedDrop == "age") {
          if((rangeValue + this.tenure) > 60){
            this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['tenureMustBeBelow60']);
            return;
          }
          else{
            this.age = rangeValue;
          }
        }
        if (this.selectedDrop == "tenure") {
          if((rangeValue + this.age) > 60){
            this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['tenureMustBeBelow60']);
            return;
          }
          else{
            this.tenure = rangeValue;
          }
        }
        this.CalculateHomeLoanEligibility();
      }
    }
  }


  CalculateHomeLoanEligibility() {
    this.pageLoader = true;
    let request = {
      "CustId"        : this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "MonthlyIncome" : this.monthlyIncome,
      "Age"           : this.age,
      "InterestRate"  : this.interestRate,
      "Tenure"        : this.tenure
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetLoanEligibilityValue')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
        // console.log(response);        
        this.eligibleLoanAmount = parseFloat(response.Data.EligibleLoanAmount)
        this.EMIPerMonth        = parseFloat(response.Data.EMI)
        this.interestPayable    = parseFloat(response.Data.InterestPayable)
        this.payableAmount      = parseFloat(response.Data.TotalAmtPayOverTenure)
        this.interestRate       = parseFloat(response.Data.InterestRate)
        this.monthlyIncome      = parseFloat(response.Data.MonthlyIncome)
        this.age                = parseFloat(response.Data.Age)
        this.tenure             = parseFloat(response.Data.TenureInYrs)
        }
        else {          
          // console.log(response);
        }
    },
    (error) => {
      this.pageLoader = false;   
    })
  }

  recalculate(){
    this.setUpshotEvent('Recalculate');
  this.navCtrl.setRoot('HomeLoanEligibilityPage');
  }

  takeScreenshot(){
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'Home Loan Caculator');
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planning');
    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'Home Loan Eligibility' })
  }
  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }

  setUpshotEvent(action) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.navParams.get('pageFrom') || '',
      "Age": this.age,
      "Monthlyncome": this.monthlyIncome,
      "HomeLoanDuration": this.tenure,
      "MaturityValue": this.eligibleLoanAmount,
      "EMI": this.EMIPerMonth,
      "InterestAmount": this.interestPayable,
      "TotalPayableAmount": this.payableAmount,
      "ROI": this.interestRate,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('HomeLoanEligibility', payload, false);
  }
}