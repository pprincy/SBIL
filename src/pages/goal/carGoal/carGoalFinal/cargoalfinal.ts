import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController,MenuController, Slides, ModalController} from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import {MyApp} from '../../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { DropDowmSelctionPage } from '../../../../components/modals/drop-dowm-selction/drop-dowm-selction';
@IonicPage()
@Component({
  selector: 'page-cargoalfinal',
  templateUrl: 'cargoalfinal.html',
})
export class CargoalfinalPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

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
  public selectedDrop;msaMin;msaMax;msaValue;headerYear;msaValueComma;
  public loanAmountChange : any = false;
  public comparePopup : any = false;
  public riskData : any = [];
  public pageLoader : boolean = false;
  public disclaimer : any = false;
  public drivenFrom;
  public modal;
  public riskProfile;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public utilitiesProvider :UtilitiesProvider, 
              private restapiProvider: RestapiProvider,
              private loadingCtrl: LoadingController,
              private numberPipe: DecimalPipe,
              public menuCtrl: MenuController,
              public myApp : MyApp,
              public modalCtrl: ModalController) {
          this.paramsData = this.navParams.get('data');
          this.finalValue = this.paramsData.Table1[0];
          this.riskProfile = this.finalValue.RiskProfile;
          this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.car;
          this.msaMin = parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.min);
          this.msaMax = this.finalValue.CurrentCostOfvehicle;
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

          this.drivenFrom = this.navParams.get('drivenFrom');
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
        //      // $('.fixed-content').css('margin-top', hedaerheight);
        //      // $('.scroll-content').css('margin-top', hedaerheight);
        //     }, 100);
        //   }
        // }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("23");
    this.utilitiesProvider.googleAnalyticsTrackView('Car Goal');
    this.yearCal()
    this.brightness = 0;
    $('.resize').css('width',  this.brightness + '%');
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
    let per =(a * 100) /  this.msaMax; //
    this.finalValue.LumpSumAvailable = a;

    this.msaValueComma = "₹" + (this.msaValue ? this.numberPipe.transform(this.msaValue.toString().replaceAll(",","")) : "0");
    
    $('.resize ').css('width', per + '%');
    if(b != 'fromJs'){
      this.CalculateHomeGoal();
    }
  }
  menuToggle(){
    this.menuCtrl.open();
  }
  
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }

  riskProfileFun(){
    this.CalculateHomeGoal();
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
  
  compareNow(type){
    this.comparePopup = false;
    if(this.comparePopup == false)
    {
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
    }
    if(type == 'compare'){
      this.paramsData.showAssets = true;
    }
    else{
      this.paramsData.showAssets = false;
    }
    this.navCtrl.push('CarAssetAllocationPage', {data : this.paramsData, from: type=='compare'?'Compare Now':'Get My Recommendations'})
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

  updateAssets(){
    this.comparePopup = false;
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
     this.paramsData.showAssets = true;

    let goalAssetsData = {
      "fromPage" : "CargoalfinalPage",
      "headerTitle" : this.utilitiesProvider.langJsonData['carGoal']['carGoal'],
      "assetsPage" : "CarAssetAllocationPage",
      "assetsData" : this.paramsData
    }
    this.navCtrl.push('GoalAssetsPage', {data : goalAssetsData})
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
        "title" :this.utilitiesProvider.langJsonData['carGoal']['rateOfInflation'],
        "type" : "perc",
        "info" : this.utilitiesProvider.infoPopupText[0].desc
      }
    }
    if(type === 'IncrementalSavings'){
      this.utilitiesProvider.rangeData = this.finalValue.IncrementalSavings_prec_yearly;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.IncrementalSavings_prec_yearly,
        "min" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.min),
        "max" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.max),
        "title" :this.utilitiesProvider.langJsonData['carGoal']['increasingSavingsRate'],
        "type" : "",
        "info" : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if(type === 'costOfCar'){
      this.utilitiesProvider.rangeData = this.finalValue.CurrentCostOfvehicle;
      this.rangeDataUi = {
        "steps" : 20000,
        "amount" :this.finalValue.CurrentCostOfvehicle,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max),
        "title" :this.utilitiesProvider.langJsonData['carGoal']['costOfCar'],
        "type" : "r",
        "info" : ""
      }
    }
     if(type === 'downPayment'){
      this.utilitiesProvider.rangeData = this.finalValue.DownPayment;
       let minDownPayment = (this.finalValue.CurrentCostOfvehicle * 20) / 100;
      this.rangeDataUi = {
        "steps" : 100,
        "amount" :this.finalValue.DownPayment,
        "min" :  minDownPayment,
        "max" : this.finalValue.CurrentCostOfvehicle,
        "title" :this.utilitiesProvider.langJsonData['carGoal']['estimatedDownPayment'],
        "type" : "r",
        "info" : ""
      }
    }
    if(type === 'timeToBuyCar'){
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
        "info" :this.utilitiesProvider.infoPopupText[2].desc
      }
    }
    if(type === 'rateOfInterest'){
      this.utilitiesProvider.rangeData = this.finalValue.EMIInterestRate;

      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.EMIInterestRate,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.max),
        "title" :this.utilitiesProvider.langJsonData['carGoal']['rateOfInterest'],
        "type" : "",
        "info" : ""
      }
    }
    if(type === 'loanAmount'){
      this.loanAmountChange = true;
      this.utilitiesProvider.rangeData = this.finalValue.LoanAmount;
      let maxloanAmount = (this.finalValue.FVCar * 90)/100
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.LoanAmount,
        "min" :  0,
        "max" :  maxloanAmount,
        "title" :this.utilitiesProvider.langJsonData['carGoal']['loanAmount'],
        "type" : "r",
        "info" : ""
      }
    }
 }

 done(){
  let d = parseInt(this.utilitiesProvider.rangeData);
  if(d < parseInt(this.rangeDataUi.min) || d > parseInt(this.rangeDataUi.max)){
    this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
  }
   else{
  if(this.selectedDrop == "inflation"){
    this.status = !this.status;
    this.finalValue.RateOfInflation = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "IncrementalSavings"){
    this.status = !this.status;
    this.finalValue.IncrementalSavings_prec_yearly = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "costOfCar"){
    this.status = !this.status;
    this.finalValue.CurrentCostOfvehicle = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "downPayment"){
    this.status = !this.status;
    this.finalValue.PerDownPayment = (this.utilitiesProvider.rangeData * 100) /  this.finalValue.CurrentCostOfvehicle;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "timeToBuyCar"){
    this.status = !this.status;
    this.finalValue.TimeForGoal = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  
  if(this.selectedDrop == "tenure"){
    this.status = !this.status;
    this.finalValue.LoanDuartion = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "rateOfInterest"){
    this.status = !this.status;
    this.finalValue.EMIInterestRate = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "loanAmount"){
    this.loanAmountChange = true;
    this.status = !this.status;
    this.finalValue.LoanAmount = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
    }
  }
}

CalculateHomeGoal() {
    this.timerStart = true;
    this.timer = setTimeout(() => {
      if(this.status == false)
      {
       $('.header').removeClass('headerOverlay');
       $('.scroll-content').removeClass('scrollOverlay');
      }
   this.pageLoader = true;
    let request = {
    "CustId": this.restapiProvider.userData['CustomerID'],
    'TokenId': this.restapiProvider.userData['tokenId'],
    "CurrentAmount": this.finalValue.CurrentCostOfvehicle,
    "Period": this.finalValue.TimeForGoal,
    "DownPaymentPerc": this.finalValue.PerDownPayment,
    "LumpsumAvailable": this.finalValue.LumpSumAvailable,
    "Inflation": this.finalValue.RateOfInflation,
    "IncrementalSavings": this.finalValue.IncrementalSavings_prec_yearly,
    "LumpsumCompound": this.finalValue.LumpsumCompound_perc ?  this.finalValue.LumpsumCompound_perc : 0,
    "RiskProfile": this.finalValue.RiskProfile_categoryID,
    "EMIInterest": this.finalValue.EMIInterestRate,
    "LoanAmount":  this.loanAmountChange == true ?  this.finalValue.LoanAmount : "",
    "LoanDuration": this.finalValue.LoanDuartion
  }
  return this.restapiProvider.sendRestApiRequest(request, 'CalculateCarGoal').subscribe((response) => {
      if (response.IsSuccess == true) {
        this.pageLoader = false;
        this.loanAmountChange = false;
        this.finalValue = response.Data.Table1[0];
        this.msaMax = this.finalValue.CurrentCostOfvehicle;
        this.paramsData =  response.Data;
        let pvOfLum = this.paramsData.Table[0].PVOFLumpsum;
        let a  = parseFloat(this.finalValue.LumpSumAvailable) +  parseFloat(pvOfLum);
        this.doSomething(a, 'fromJs');
        // console.log(response.Data)
        // console.log(this.utilitiesProvider.defaultGoalData)
      }
      else {
        this.pageLoader = false;
        // console.log(response);
      }
    },
    (error) => {
      this.pageLoader = false;
    })
  },500)
}

replan(){
  this.setUpshotEvent('Replan');

  this.navCtrl.setRoot('CargoalPage', { pageFrom: this.drivenFrom})
}
yearCal(){
  let headYear = new Date().getFullYear();
  this.headerYear =  headYear + this.finalValue.TimeForGoal;
}
  loaderShow(){
    this.pageLoader = true;
  }
  takeScreenshot(){
    // this.utilitiesProvider.screenShotURI();
    this.content.scrollToTop();
    this.pageLoader = true;
    setTimeout(() => {
      this.utilitiesProvider.htmlToCanvas("capture-cargoal").then(result => {
        setTimeout(() => {
          this.pageLoader = false;
        }, 1500);
      })
    }, 1000);

    this.utilitiesProvider.setUpshotShareEvent('Goal', 'Car Goal');
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

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', currentIndex);
    this.content.scrollToTop();
  }
 
  
  makeRound(n){
    return Math.round(n);
  }

  setUpshotEvent(action) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.drivenFrom,
      "CarType": this.navParams.get('carType') || '',
      "CarPrice": this.finalValue.CurrentCostOfvehicle,
      "InYear": (new Date()).getFullYear() + Number(this.finalValue.TimeForGoal),
      "Duration": this.finalValue.TimeForGoal,
      "DownPaymentPercent": this.finalValue.PerDownPayment,
      "DownPaymentAmt": this.finalValue.DownPayment,
      "AnnualCorpus": this.finalValue.Diffrence,
      "FVCar": this.finalValue.FVCar,
      "SuggestedSaving": this.finalValue.MonthlySavingRequired,
      "SavedMoney": this.msaValue,
      "Risk": this.riskData.filter(el=>el.ProfileID == this.finalValue.RiskProfile_categoryID)[0]["Profiler_Name"],
      "InflationRate": this.finalValue.RateOfInflation,
      "IncreasingSavingRate": this.finalValue.IncrementalSavings_prec_yearly,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('CarGoal', payload, false);
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
      };
      return obj;
    }
      
    );
    console.log("country list", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.riskProfile
      },
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


