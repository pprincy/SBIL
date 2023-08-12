import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController,MenuController, ModalController} from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import {MyApp} from '../../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { DropDowmSelctionPage } from '../../../../components/modals/drop-dowm-selction/drop-dowm-selction';
@IonicPage()
@Component({
  selector: 'page-childeducationfinal',
  templateUrl: 'childeducationfinal.html',
})
export class ChildeducationfinalPage {
  @ViewChild(Content) content: Content;
  public brightness;
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
  public pageLoader : boolean = false;
  public disclaimer : any = false;
  public selectedDrop; msaMin; msaMax; msaValue; headerYear; msaValueComma;
  public riskData : any = [];
  public drivenFrom;
  public modal;
  public riskProfile;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public utilitiesProvider :UtilitiesProvider, 
              private restapiProvider: RestapiProvider,
              private loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              private numberPipe: DecimalPipe,
              public myApp : MyApp,
              public modalCtrl: ModalController) {
             this.paramsData = this.navParams.get('data');
             this.finalValue = this.paramsData.Table1[0];
             this.riskProfile = this.finalValue.RiskProfile;
            //  console.log("finalvalue list",this.finalValue);
             this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.education;
            this.msaMin = parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.min);
            this.msaMax = this.finalValue.CurrentCostOfEducation;
            let pvOfLum = this.paramsData.Table[0].PVOFLumpsum;
            this.msaValue  = parseFloat(this.finalValue.LumpSumAvailable) +  parseFloat(pvOfLum);   
            
            let amount : number = 0;
            let amountStr : String = "0";
            if(this.msaValue) {
              amount = Number(this.msaValue.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
              amountStr = amount.toLocaleString('en-IN');
            }

            this.msaValueComma = "₹" + amountStr;      
            let getMasters = this.utilitiesProvider.GetMasterData;
            this.riskData = getMasters.Table4;
            // console.log("this.riskData", this.riskData)
            this.drivenFrom = this.navParams.get('drivenFrom');
          }

          //  top = 0;
          //  scrollToTop() {
          //    setTimeout(() => {
          //      this.cssCahnge();
          //    }, 100);
          //  }
         
          //  cssCahnge() {
          //    if (this.top == 0) {
          //      $('.networth_details').removeClass('shrink');
          //      setTimeout(function () {
          //      //  $('.fixed-content').css('margin-top', $('.top_area').height() - 21);
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
    this.myApp.updatePageUseCount("24");
    this.utilitiesProvider.googleAnalyticsTrackView('Education Goal');
    this.yearCal();
    this.brightness = 0;
    $('.resize').css('width',  this.brightness + '%');
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
    let per =(a * 100) /  this.msaMax;
    this.finalValue.LumpSumAvailable = a;

    this.msaValueComma = "₹" + (a ? this.numberPipe.transform(a.toString().replaceAll(",","")) : "");

    $('.resize ').css('width', per + '%');
    if(b == 'fromHtml'){
      this.CalculateCourseGoal();
    }
  }
  menuToggle(){
    this.menuCtrl.open();
  }
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }
  riskProfileFun(){
    this.CalculateCourseGoal();
  }

  assetAllocation(){
    this.comparePopup = true;
    if(this.comparePopup == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }

    this.setUpshotEvent('Suggest Invesment');
  }
  updateAssets(){
    this.comparePopup = false;
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
     this.paramsData.showAssets = true;

    let goalAssetsData = {
      "fromPage" : "ChildeducationfinalPage",
      "headerTitle" : this.utilitiesProvider.langJsonData['educationGoal']['educationGoal'],
      "assetsPage" : "EducationAssetAllocationPage",
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
      if(this.comparePopup == false)
    {
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
    }
    
    this.navCtrl.push('EducationAssetAllocationPage', {data : this.paramsData, from: type=='compare'?'Compare Now':'Get My Recommendations'})
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
 showOverlay(type){
    this.status = !this.status;
    if(this.status == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    
   
    this.selectedDrop = type;  
     if(type === 'inflation'){
      this.utilitiesProvider.rangeData = this.finalValue.RateOfInflation;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.RateOfInflation,
        "min" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.min),
        "max" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.max),
        "title" :this.utilitiesProvider.langJsonData['educationGoal']['rateOfInflation'],
        "type" : "perc",
        "info" : this.utilitiesProvider.infoPopupText[0].desc
      }
    }
    if(type === 'IncrementalSavings'){
      this.utilitiesProvider.rangeData = this.finalValue.IncrementalSavings_perc_yearly;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.IncrementalSavings_perc_yearly,
        "min" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.min),
        "max" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.max),
        "title" :this.utilitiesProvider.langJsonData['educationGoal']['increasingSavingsRate'],
        "type" : "",
        "info" : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if(type === 'costOfCourse'){
      this.utilitiesProvider.rangeData = this.finalValue.CurrentCostOfEducation;
      this.rangeDataUi = {
        "steps" : 25000,
        "amount" :this.finalValue.CurrentCostOfEducation,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max),
        "title" :this.utilitiesProvider.langJsonData['educationGoal']['currentCostOfCourse'],
        "type" : "r",
        "info" : ""
      }
    }
     if(type === 'downPayment'){
      this.utilitiesProvider.rangeData = this.finalValue.DownPayment;
       let minDownPayment = (this.finalValue.CurrentCostOfHome * 20) / 100;
      this.rangeDataUi = {
        "steps" : 100,
        "amount" :this.finalValue.DownPayment,
        "min" :  minDownPayment,
        "max" : this.finalValue.CurrentCostOfHome,
        "title" :this.utilitiesProvider.langJsonData['educationGoal']['enterMonthlyExpensesBetween'],
        "type" : "r",
        "info" : ""
      }
    }
    
    if(type === 'timeToGoal'){
      this.utilitiesProvider.rangeData = this.finalValue.TimeForGoal;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.TimeForGoal,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.max),
        "title" :this.utilitiesProvider.commonLangMsg['duration'],
        "type" : "",
        "info" : ""
      }
    }
    if(type === 'tenure'){
      this.utilitiesProvider.rangeData = this.finalValue.LoanDuartion;

      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.LoanDuartion,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.loan_duration_yr.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.loan_duration_yr.max),
        "title" :this.utilitiesProvider.commonLangMsg['duration'],
        "type" : "",
        "info" : ""
      }
    }
    if(type === 'rateOfInterest'){
      this.utilitiesProvider.rangeData = this.finalValue.EMIInterestRate;

      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.EMIInterestRate,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.max),
        "title" :this.utilitiesProvider.langJsonData['educationGoal']['enterMonthlyExpensesBetween'],
        "type" : "",
        "info" : ""
      }
    }
    if(type === 'loanAmount'){
      this.utilitiesProvider.rangeData = this.finalValue.LoanAmount;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.LoanAmount,
        "min" :  1,
        "max" :  this.finalValue.CurrentCostOfHome - this.finalValue.DownPayment,
        "title" :this.utilitiesProvider.langJsonData['educationGoal']['enterMonthlyExpensesBetween'],
        "type" : "r",
        "info" : ""
      }
    }
 
}

 done(){

  let d = parseFloat(this.utilitiesProvider.rangeData);

  
  if(d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)){
    this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
  }
   else{
  if(this.selectedDrop == "inflation"){
    this.status = !this.status;
    this.finalValue.RateOfInflation = this.utilitiesProvider.rangeData;
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "IncrementalSavings"){
    this.status = !this.status;
    this.finalValue.IncrementalSavings_perc_yearly = this.utilitiesProvider.rangeData;
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "costOfCourse"){
    this.status = !this.status;
    this.finalValue.CurrentCostOfEducation = this.utilitiesProvider.rangeData;
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "downPayment"){
    this.status = !this.status;
    this.finalValue.PerDownPayment = (this.utilitiesProvider.rangeData * 100) /  this.finalValue.CurrentCostOfHome;
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "timeToGoal"){
    this.status = !this.status;
    this.finalValue.TimeForGoal = parseInt(this.utilitiesProvider.rangeData);
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "tenure"){
    this.status = !this.status;
    this.finalValue.LoanDuartion = this.utilitiesProvider.rangeData;
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "rateOfInterest"){
    this.status = !this.status;
    this.finalValue.EMIInterestRate = this.utilitiesProvider.rangeData;
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "loanAmount"){
    this.status = !this.status;
    this.finalValue.LoanAmount = this.utilitiesProvider.rangeData;
     this.CalculateCourseGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
    }
  }
 }

 CalculateCourseGoal() {
    this.timerStart = true;
    this.timer = setTimeout(() => {
      this.pageLoader = true;
  let request = {
    "CustId": this.restapiProvider.userData['CustomerID'],
    'TokenId': this.restapiProvider.userData['tokenId'],
    "CurrentAmount": this.finalValue.CurrentCostOfEducation,
    "Period":this.finalValue.TimeForGoal, 
    "LumpsumAvailable":this.finalValue.LumpSumAvailable,
    "Inflation": this.finalValue.RateOfInflation,
    "IncrementalSavings":this.finalValue.IncrementalSavings_perc_yearly,
    "LumpsumCompound":this.finalValue.LumpsumCompound_perc ?  this.finalValue.LumpsumCompound_perc : 0,
    "RiskProfile": this.finalValue.RiskProfile_categoryID,
     }
  return this.restapiProvider.sendRestApiRequest(request, 'CalculateEducationGoal').subscribe((response) => {
    this.pageLoader = false;
    if (response.IsSuccess == true) {
        this.finalValue = response.Data.Table1[0];
        this.paramsData =  response.Data;
        this.msaMax = this.finalValue.CurrentCostOfEducation;
        let pvOfLum = this.paramsData.Table[0].PVOFLumpsum;
        let a  = parseFloat(this.finalValue.LumpSumAvailable) +  parseFloat(pvOfLum);
        this.doSomething(a, 'fromJs');
        this.yearCal();
      }
      else {
        this.pageLoader = false;
      }
    },
    (error) => {
      this.pageLoader = false;
    })
  },500)
}

replan(){

  this.setUpshotEvent('Replan');

  this.navCtrl.setRoot('ChildEducationPage', { pageFrom: this.drivenFrom})
}
    
      takeScreenshot(){
        // this.utilitiesProvider.screenShotURI();
        this.content.scrollToTop();
        this.pageLoader = true;
        setTimeout(() => {
          this.utilitiesProvider.htmlToCanvas("capture-childeducation").then(result => {
            setTimeout(() => {
              this.pageLoader = false;
            }, 1500);
          })
        }, 1000);

        this.utilitiesProvider.setUpshotShareEvent('Goal', 'Education Goal');
      }
      yearCal(){
        let headYear = new Date().getFullYear();
        this.headerYear =  headYear + this.finalValue.TimeForGoal;
      }
      clearStartZero(option){
        if(option == 'lumsum'             &&
           (this.msaValue == 0        ||
           isNaN(this.msaValue)       ||
           this.msaValue == null)){
          this.msaValue = null;
          this.msaValueComma = "₹" + "";
        }
      }
      tipsText(suggetedSaving){
        return  this.utilitiesProvider.savingSuggestedTipsTest(suggetedSaving);
         }

         goNotificationList(){
          this.navCtrl.push('NotificationPage');
        }

  setUpshotEvent(action) {
    let data = this.navParams.get('otherData');

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.drivenFrom,
      "CurrentAge": data.currentAge,
      "AgeDuringCourse": data.ageDuringCoarse,
      "CourseFee": this.finalValue.CurrentCostOfEducation,
      "Degree": data.degree,
      "Courses": data.courses,
      "InIndia": data.isInIndia,
      "AnnualCorpusNeeded": this.finalValue.RequiredForEducation,
      "FVCourse": this.finalValue.FVEducation,
      "SuggestedSavings": this.finalValue.MonthlySavingRequired,
      "AlreadySavedAmount": this.msaValue,
      "Risk": this.riskData.filter(el=> el.ProfileID == this.finalValue.RiskProfile_categoryID)[0]["Profiler_Name"],
      "InflationRate": this.finalValue.RateOfInflation,
      "SavingRate": this.finalValue.IncrementalSavings_perc_yearly,
      "Duration": this.finalValue.TimeForGoal,
      "Action": action
    }
    this.utilitiesProvider.upshotCustomEvent('EducationGoal', payload, false);
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

  async RiskData(){
    let commonList = this.riskData.map(el => {
      const obj = {
        name: el.Profiler_Name,
        value: el.ProfileID,
        selectOption: this.riskProfile
      };
      return obj;
    }
      
    );
    console.log("country list", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.finalValue.RiskProfile_categoryID = data;
        this.riskData.forEach(element => {
          if(element.ProfileID == data){
            this.riskProfile = element.Profiler_Name;
          }
        });

        this.riskProfileFun()
    })

  }
}


