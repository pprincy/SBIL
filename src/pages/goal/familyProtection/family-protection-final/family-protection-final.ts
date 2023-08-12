import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController,MenuController} from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import {MyApp} from '../../../../app/app.component';
import { DecimalPipe } from '@angular/common';
@IonicPage()
@Component({
  selector: 'page-family-protection-final',
  templateUrl: 'family-protection-final.html',
})
export class FamilyProtectionFinalPage {
  @ViewChild(Content) content: Content;
  brightness;
  public steps = 100;
  public amountD1;
  public amountD2;
  public minValue ;
  public maxValue ;
  public isBtnActive:boolean = false;
  public status:boolean = false;
  public Daughter1 : any = {};
  public Daughter2: any = {};
  public paramsData :any;
  public loading : any;
  public timerStart : boolean = false;
  public timer : any;
  public graphData : any = {};
  public rangeDataUi : any = {};
  public finalValue : any = {};
  public comparePopup : any = false;
  public annuity : any = false;
  public disclaimer : any = false;
  public riskData : any = [];
  public pageLoader : boolean = false;
  public selectedDrop;msaMin;msaMax;msaValue;headerYear;msaValueComma;
  public minMonthlyIncome; public maxMonthlyIncome; public monthlyIncome; 
  public minMonthlyExpenses; public maxMonthlyExpenses; public monthlyExpenses;
  public saveGoalPopup :boolean = false;
  public showAdb : boolean = true;
  public showTpd : boolean = true;
  public requestPara : any = {};
  public popupShow : boolean = false;
  public popupText;
  public drivenFrom;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public utilitiesProvider :UtilitiesProvider, 
              private restapiProvider: RestapiProvider,
              private loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              private numberPipe: DecimalPipe,
              public myApp : MyApp) {
            this.paramsData = this.navParams.get('data');
            this.showAdb =  this.paramsData['adb'];
            this.showTpd =  this.paramsData['tpd'];
            this.finalValue = this.paramsData.response.Table[0];
            this.requestPara = this.paramsData['request'];
            this.msaMin = 0;
            // this.msaMax = 10000000;
            this.msaMax = this.finalValue.ExistingCover + this.finalValue.SuggestedCover;
            this.msaValue = this.finalValue.ExistingCover > 0 ?  this.finalValue.ExistingCover : 0
            
            let amount : number = 0;
            let amountStr : String = "";
            if(this.msaValue) {
              amount = Number(this.msaValue.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
              amountStr = amount.toLocaleString('en-IN');
            }
            
            this.msaValueComma = "₹" + amountStr;
            this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.family_protection;
            this.minMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.min);
            this.maxMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.max);
            this.minMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.min);
            this.maxMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.max);
            setTimeout(() => {
              this.doSomething(this.msaValue, 'fromJs');
            }, 200);
           
            this.drivenFrom = this.navParams.get('drivenFrom');
          }

          //  top = 0;
          //  scrollToTop() {
          //    setTimeout(() => {
          //      this.cssCahnge();
          //    }, 100);
          //  }
         
          //  cssCahnge() {
          //   if (this.top < $('.ba-slider').offset().top) {
          //      $('.networth_details').removeClass('shrink');
          //      setTimeout(function () {
          //       // $('.fixed-content').css('margin-top', $('.top_area').height() - 21);
          //       // $('.scroll-content').css('margin-top', $('.top_area').height() - 21);
          //      }, 100);
         
          //    }
          //    else {
          //      $('.networth_details').addClass('shrink');
          //      setTimeout(function () {
          //        var hedaerheight = $('.shrink').parent().outerHeight();
          //       // $('.fixed-content').css('margin-top', hedaerheight);
          //       // $('.scroll-content').css('margin-top', hedaerheight);
          //      }, 100);
          //    }
         
          //  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("28");
    this.utilitiesProvider.googleAnalyticsTrackView('Family Protection Goal');

    this.yearCal();
    // this.brightness = 0;
    // $('.resize').css('width',  this.brightness + '%');
    $('.swiper-pagination-bullet').hide();
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
  }
  annutiyInfo(){
    this.annuity = !this.annuity;
    if(this.annuity == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  disclaimerInfo(){
    this.disclaimer = !this.disclaimer;
    if(this.disclaimer == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  annuityClose(){
    this.annuity = !this.annuity;
    if(this.annuity == false)
    {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
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
  
  doSomething(a, b){
    if(this.timerStart){
      clearTimeout(this.timer);
    }
    if(a >= (this.msaMax / 3) && a <= (this.msaMax / 2)){
      this.steps = 1000;
    }
    else if(a >= (this.msaMax / 2) ){
    this.steps = 2000;
    }   
    let per =(a * 100) /  this.msaMax; //
    this.finalValue.ExistingCover = a;

    this.msaValueComma = "₹" + (this.msaValue ? this.numberPipe.transform(this.msaValue.toString().replaceAll(",","")) : "0");
    
    $('.resize').css('width', per + '%');
    if(b == 'fromHtml'){
      this.calculateFamilyProtectionGoal();
    }
  }
  menuToggle(){
    this.menuCtrl.open();
  }
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }
  riskProfileFun(){
    this.calculateFamilyProtectionGoal();
  }

  assetAllocation(){
    this.comparePopup = true;
    if(this.comparePopup == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }
  updateAssets(){
    this.comparePopup = false;
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
    let goalAssetsData = {
      "fromPage" : "RetirementGoalFinalPage",
      "headerTitle" : "Retirment Goal",
      "assetsPage" : "RetirementAssetAllocationPage",
      "assetsData" : this.paramsData
    }
    this.navCtrl.push('GoalAssetsPage', {data : goalAssetsData})
  }
  compareNow(type){
    this.comparePopup = false;
    if(type == 'compare'){
      this.paramsData.showAssets = true;
    }
    else{
      this.paramsData.showAssets = false;
    }
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
    this.navCtrl.push('RetirementAssetAllocationPage', {data : this.paramsData})
  }
 showOverlay(type){
    this.status = !this.status;
    if(this.status == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    
   
    this.selectedDrop = type;  
    
    
    if(type === 'Monthly_Income'){
      this.utilitiesProvider.rangeData = this.finalValue.Income;
      this.rangeDataUi = {
        "steps" : 100,
        "amount" :this.finalValue.Income,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.max),
        "title" :this.utilitiesProvider.langJsonData['familyProtection']['monthlyIncome'],
        "type" : "r",
        "info" : ""
      }
    }

    
    if(type === 'Monthly_Expense'){
      this.utilitiesProvider.rangeData = this.finalValue.Monthly_Expense;
      this.rangeDataUi = {
        "steps" : 100,
        "amount" :this.finalValue.Monthly_Expense,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.max),
        "title" :this.utilitiesProvider.langJsonData['familyProtection']['monthlyExpenses'],
        "type" : "r",
        "info" : ""
      }
    }
    
    if(type === 'RetirementAge'){
      this.utilitiesProvider.rangeData = this.finalValue.RetirementAge;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.RetirementAge,
        "min" :  40,
        "max" :  70,
        "title" :this.utilitiesProvider.langJsonData['familyProtection']['retirementAge'],
        "type" : "",
        "info" : ""
      }
    }
}

 done(){

  let d = parseFloat(this.utilitiesProvider.rangeData);

  
  if(d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)){
    this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
  }
   else{
 
  if(this.selectedDrop == "Monthly_Income"){
    this.status = !this.status;
    this.finalValue.Income = this.utilitiesProvider.rangeData;
     this.calculateFamilyProtectionGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }

  if(this.selectedDrop == "Monthly_Expense"){
    this.status = !this.status;
    this.finalValue.Monthly_Expense = this.utilitiesProvider.rangeData;
     this.calculateFamilyProtectionGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "RetirementAge"){
    this.status = !this.status;
    this.finalValue.RetirementAge = this.utilitiesProvider.rangeData;
     this.calculateFamilyProtectionGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  
  }
 }

 calculateFamilyProtectionGoal() {
    this.timerStart = true;
    this.timer = setTimeout(() => {
    this.pageLoader = true;
     let request = this.requestPara;
     request.ExistingCover = this.msaValue;
     request.Income = this.finalValue.Income;
     request.RetirementAge =  this.finalValue.RetirementAge;
    //  console.log(request)
  return this.restapiProvider.sendRestApiRequest(request, 'CalculateFamilyProtectionGoalNew').subscribe((response) => {
    this.pageLoader = false; 
    if (response.IsSuccess == true) {
        this.finalValue = response.Data.Table[0];
        this.finalValue.Income = this.finalValue.Income /12;
        this.msaMin = 0;
        // this.msaMax = 10000000;
        this.msaMax = this.finalValue.ExistingCover + this.finalValue.SuggestedCover;
        this.msaValue = this.finalValue.ExistingCover > 0 ?  this.finalValue.ExistingCover : 0;
        
        let amount : number = 0;
        let amountStr : String = "";
        if(this.msaValue) {
          amount = Number(this.msaValue.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
          amountStr = amount.toLocaleString('en-IN');
        }
        
        this.msaValueComma = "₹" + amountStr;
         this.doSomething(this.msaValue, 'fromJs');
      }
    },
    (error) => {
      this.pageLoader = false;
    })
  },500)
}

replan(){

  this.setUpshotEvent('Replan', 'No');

  this.navCtrl.setRoot('FamilyProtectionPage', { pageFrom: this.drivenFrom })
}
  takeScreenshot() {
    // this.utilitiesProvider.screenShotURI();
    this.content.scrollToTop();
    this.pageLoader = true;
    setTimeout(() => {
      this.utilitiesProvider.htmlToCanvas("capture-familyprotection").then(result => {
        setTimeout(() => {
          this.pageLoader = false;
        }, 1500);
      })
    }, 1000);

    this.utilitiesProvider.setUpshotShareEvent('Goal', 'Family Protection Goal');
  }
      yearCal(){
        let headYear = new Date().getFullYear();
        this.headerYear =  headYear + this.finalValue.TimeToInvest;
      }
      clearStartZero(option){
        if(option == 'lumsum'             &&
           (this.msaValue == 0        ||
           isNaN(this.msaValue)       ||
           this.msaValue == null)){
          this.msaValue = null;
          this.msaValueComma = "₹" ;
        }
        }
        tipsText(suggetedSaving){
          return  this.utilitiesProvider.savingSuggestedTipsTest(suggetedSaving);
         }
        
        goNotificationList(){
          this.navCtrl.push('NotificationPage');
        }
         
        goToArticles(){
          this.saveGoalPopup = ! this.saveGoalPopup;
         // this.navCtrl.setRoot('ArticlesPage',{source: 'Collections', header: 'Explore', categoryID: 102});
        }

        
    saveFunction(type){
      if(type == "dont"){

          this.setUpshotEvent('Read Articles', 'No');

          this.saveGoalPopup = ! this.saveGoalPopup;
          this.navCtrl.setRoot('ArticlesPage',{source: 'Collections', header: 'Family Protection', categoryID: 4});
       }
      else{
        this.setUpshotEvent('Read Articles', 'Yes');
        this.insertUserGoal();
      }
    }




    insertUserGoal(){
      this.pageLoader = true;  
      let request = {
        "CustId":this.restapiProvider.userData['CustomerID'],
        "TokenID":this.restapiProvider.userData['tokenId'],
        "GoalName":"Family Protection",
        "GoalTypeID":"7",
        "CurrentAmount":this.finalValue.Income,
        "Period":this.finalValue.RetirementAge,
        "LumpsumAvailable":this.msaValue ,
        "Inflation":null,
        "IncrementalSavings":null,
        "LumpsumCompound":null,
        "RiskProfile":null,
        "EMIInterest":null,
        "FVGoal":null,
        "FVDownPayment":null,
        "RequiredDownpayment":this.finalValue.SuggestedCover,
        "MonthlySavingsRequired":this.finalValue.SuggestedADBCover,
        "DownPaymentPerc":this.finalValue.SuggestedTDPCover,
        "LoanAmount":null,
        "LoanDuration":null,
        //"Monthly_Income":5000,     Need to add this
        // "Monthly_Expense":5000.0,
        }
        
      return this.restapiProvider.sendRestApiRequest(request, 'InsertUserGoal').subscribe((response) => {
        this.pageLoader = false;  
          if (response.IsSuccess == true) {
            this.restapiProvider.presentToastTop(this.utilitiesProvider.langJsonData['common']['goalSavedSuccessfully']);
            this.saveGoalPopup = ! this.saveGoalPopup;
            this.navCtrl.setRoot('ArticlesPage',{source: 'Collections', header: this.utilitiesProvider.langJsonData['familyProtection']['familyProtection'], categoryID: 4});
          }
           },
        (error) => {
          this.pageLoader = false;
          })
    }

    goBack(){
      this.navCtrl.pop();
    }


    info(i){
      this.popupShow = !this.popupShow;
      if(i == 1){
        this.popupText = this.utilitiesProvider.langJsonData['familyProtection']['adbPopup'];
      }
      if(i == 2){
        this.popupText = this.utilitiesProvider.langJsonData['familyProtection']['tpdPopup'];
      }
      }
      hideDisclaimer(){
        this.popupShow = !this.popupShow;
      }

  setUpshotEvent(action, savedGoal) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.drivenFrom,
      "RetirementAge": this.finalValue.RetirementAge,
      "CurrentAge": this.finalValue.CurrentAge,
      "MonthlyIncome": this.finalValue.Income,
      "ADBRider": this.finalValue.ADB_REQ,
      "TPDRider": this.finalValue.TPD_REQ,
      "DriveLongDistance": this.paramsData.request.QuesAns[0].AnswerID ? "Yes" : "No",
      "PublicTransport": this.paramsData.request.QuesAns[1].AnswerID ? "Yes" : "No",
      "Smoke": this.paramsData.request.QuesAns[2].AnswerID ? "Yes" : "No",
      "Major_Illness": this.paramsData.request.QuesAns[3].AnswerID ? "Yes" : "No",
      "TotalLifeInsurance": this.finalValue.SuggestedCover,
      "SuggestedABD": this.finalValue.SuggestedADBCover,
      "SuggestedTPD": this.finalValue.SuggestedTDPCover,
      "ExistingLifeCover": this.msaValue,
      "Action": action,
      "SavedGoal": savedGoal
    }
    this.utilitiesProvider.upshotCustomEvent('SetFamilyProtectionGoal', payload, false);
  }

  formatAmount(val) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    
    this.msaValueComma = "₹" + amountStr;
    this.msaValue = amount;
  }
}




