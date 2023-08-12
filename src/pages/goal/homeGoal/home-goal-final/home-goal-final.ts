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
  selector: 'page-home-goal-final',
  templateUrl: 'home-goal-final.html',
})
export class HomeGoalFinalPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

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
              public menuCtrl: MenuController,
              private numberPipe: DecimalPipe,
              public myApp : MyApp,
              public modalCtrl: ModalController) {

             this.paramsData = this.navParams.get('data');
             this.finalValue = this.paramsData.Table1[0];
             this.riskProfile = this.finalValue.RiskProfile;
            //  console.log(this.paramsData)
             this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.home;
            this.msaMin = parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.min);
            this.msaMax = this.finalValue.CurrentCostOfHome;
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
          //     //  $('.fixed-content').css('margin-top', hedaerheight);
          //     //  $('.scroll-content').css('margin-top', hedaerheight);
          //     }, 100);
          //   }
        
          // }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("22");
    this.utilitiesProvider.googleAnalyticsTrackView('Home Goal');
    this.yearCal();
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

    this.msaValueComma = "₹" + (a ? this.numberPipe.transform(a.toString().replaceAll(",","")) : "0");

    $('.resize ').css('width', per + '%');
    if(b == 'fromHTML'){
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
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');

  this.setUpshotEvent('Suggest Invesment');
  }

  updateAssets(){
    this.comparePopup = false;
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
     this.paramsData.showAssets = true;
    let goalAssetsData = {
      "fromPage" : "HomeGoalFinalPage",
      "headerTitle" : this.utilitiesProvider.langJsonData['homeGoal']['homeGoal'],
      "assetsPage" : "HomeAssetAllocationPage",
      "assetsData" : this.paramsData
    }
    this.navCtrl.push('GoalAssetsPage', {data : goalAssetsData})
  }

  compareNow(type){
    this.comparePopup = false;
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
     if(type == 'compare'){
      this.paramsData.showAssets = true;
    }
    else{
      this.paramsData.showAssets = false;
    }
    this.navCtrl.push('HomeAssetAllocationPage', {data : this.paramsData, from: type=='compare'?'Compare Now':'Get My Recommendations'})
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
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.inflation_rate.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.inflation_rate.max),
        "title" :this.utilitiesProvider.langJsonData['homeGoal']['rateOfInflation'],
        "type" : "perc",
        "info"  : this.utilitiesProvider.infoPopupText[0].desc
      }
    }
    if(type === 'IncrementalSavings'){
      this.utilitiesProvider.rangeData = this.finalValue.IncrementalSavings_prc_yearly;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.IncrementalSavings_prc_yearly,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.max),
        "title" :this.utilitiesProvider.langJsonData['homeGoal']['increasingSavingsRate'],
        "type" : "",
        "info"  : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if(type === 'costOfHome'){
      this.utilitiesProvider.rangeData = this.finalValue.CurrentCostOfHome;
      this.rangeDataUi = {
        "steps" : 200000,
        "amount" :this.finalValue.CurrentCostOfHome,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max),
        "title" :this.utilitiesProvider.langJsonData['homeGoal']['costOfHome'],
        "type" : "r",
        "info"  : ""
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
        "title" :  this.utilitiesProvider.langJsonData['homeGoal']['estimatedDownPayment'],
        "type" : "r",
        "info"  : ""
      }
    }
    
    if(type === 'timeToBuyHome'){
      this.utilitiesProvider.rangeData = this.finalValue.TimeForGoal;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.TimeForGoal,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.max),
        "title" :this.utilitiesProvider.commonLangMsg['duration'],
        "type" : "",
        "info"  : ""
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
        "info"  : this.utilitiesProvider.infoPopupText[2].desc
      }
    }
    if(type === 'rateOfInterest'){
      this.utilitiesProvider.rangeData = this.finalValue.EMIInterestRate;

      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.EMIInterestRate,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.max),
        "title" :this.utilitiesProvider.langJsonData['homeGoal']['rateOfInterest'],
        "type" : "",
        "info"  : ""
      }
    }
    if(type === 'loanAmount'){
      this.utilitiesProvider.rangeData = this.finalValue.LoanAmount;
      this.loanAmountChange = true;
      let maxloanAmount = (this.finalValue.FVOfHome * 90)/100
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.LoanAmount,
        "min" :  0,
        "max" :  maxloanAmount,
        "title" : this.utilitiesProvider.langJsonData['homeGoal']['loanamount'],
        "type" : "r",
        "info"  : ""
      }
    }
 
}

 done(){
  let d = parseFloat(this.utilitiesProvider.rangeData);

  
  if(d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)){
    this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " +  this.rangeDataUi.max)
  }
   else{
  if(this.selectedDrop == "inflation"){
    this.status = !this.status;
    this.finalValue.RateOfInflation = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "IncrementalSavings"){
    this.status = !this.status;
    this.finalValue.IncrementalSavings_prc_yearly = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "costOfHome"){
    this.status = !this.status;
    this.finalValue.CurrentCostOfHome = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "downPayment"){
    this.status = !this.status;
    this.finalValue.PerDownPayment = (this.utilitiesProvider.rangeData * 100) /  this.finalValue.CurrentCostOfHome;
     this.CalculateHomeGoal();
  }
  if(this.selectedDrop == "timeToBuyHome"){
    this.status = !this.status;
    this.finalValue.TimeForGoal = parseInt(this.utilitiesProvider.rangeData);
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
    this.status = !this.status;
    this.finalValue.LoanAmount = this.utilitiesProvider.rangeData;
     this.CalculateHomeGoal();
    }
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



  disclaimerClose(){
  this.disclaimer = !this.disclaimer;

  if(this.disclaimer == false)
  {
    $('.header').removeClass('headerOverlay');
    $('.scroll-content').removeClass('scrollOverlay');
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
    "CurrentAmount": this.finalValue.CurrentCostOfHome,
    "Period": this.finalValue.TimeForGoal,
    "DownPaymentPerc": this.finalValue.PerDownPayment,
    "LumpsumAvailable": parseInt(this.finalValue.LumpSumAvailable),
    "Inflation": this.finalValue.RateOfInflation,
    "IncrementalSavings": this.finalValue.IncrementalSavings_prc_yearly,
    "LumpsumCompound": this.finalValue.LumpsumCompound_prc ?  this.finalValue.LumpsumCompound_prc    : 0,
    "RiskProfile": this.finalValue.RiskProfile_categoryID,
    "EMIInterest": this.finalValue.EMIInterestRate,
    "LoanAmount":  this.loanAmountChange == true ?  this.finalValue.LoanAmount : "",
    "LoanDuration": this.finalValue.LoanDuartion
  }
  return this.restapiProvider.sendRestApiRequest(request, 'CalculateHomeGoal').subscribe((response) => {
    this.pageLoader = false;
    if (response.IsSuccess == true) {
        this.loanAmountChange = false;
        this.paramsData =  response.Data;
        this.finalValue = response.Data.Table1[0];
        this.msaMax = this.finalValue.CurrentCostOfHome;
        this.yearCal();
        let pvOfLum = this.paramsData.Table[0].PVOFLumpsum;
        let a  = parseFloat(this.finalValue.LumpSumAvailable) +  parseFloat(pvOfLum);
        this.doSomething(a, 'fromJs');
        // console.log(response.Data)
        // console.log(this.utilitiesProvider.defaultGoalData)
      }
      else {
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

      this.navCtrl.setRoot('HomeGoalPage', { pageFrom: this.drivenFrom})
    }
        
      takeScreenshot(){
        // this.utilitiesProvider.screenShotURI();
        this.content.scrollToTop();
        this.pageLoader = true;
        setTimeout(() => {
          this.utilitiesProvider.htmlToCanvas("capture-homegoal").then(result => {
            setTimeout(() => {
              this.pageLoader = false;
            }, 1500);
          })
        }, 1000);

        this.utilitiesProvider.setUpshotShareEvent('Goal', 'Home Goal');
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
          this.msaValueComma = "₹" + "0";
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
            "Duration": this.finalValue.TimeForGoal,
            "InYear": (new Date()).getFullYear() + Number(this.finalValue.TimeForGoal),
            "HomeCost": this.finalValue.CurrentCostOfHome,
            "DownPaymentPercent": this.finalValue.PerDownPayment,
            "DownPaymentValue": this.finalValue.DownPayment,
            "CorpusNeeded": this.finalValue.RequiredDownPayment,
            "FVHome": this.finalValue.FVOfHome,
            "SuggestedSaving": this.finalValue.MonthlySavingRequired,
            "AlreadySavedAmt": this.msaValue,
            "Risk": this.riskData.filter(el=>el.ProfileID == this.finalValue.RiskProfile_categoryID)[0]["Profiler_Name"],
            "InflationRate": this.finalValue.RateOfInflation,
            "IncreasingSavingRate": this.finalValue.IncrementalSavings_prc_yearly,
            "Action": action
          }
          // console.log(payload)
          this.utilitiesProvider.upshotCustomEvent('HomeGoal', payload, false);
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
              selectOption: this.riskProfile },
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





