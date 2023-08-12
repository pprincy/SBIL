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
  selector: 'page-marriage-final',
  templateUrl: 'marriage-final.html',
})
export class MarriageFinalPage {
  @ViewChild(Content) content: Content;
  brightness;
  public steps = 100;
  public isBtnActive:boolean = false;
  public status:boolean = false;
  public navParamsData : any = {};
  public paramsData :any;
  public loading : any;
  public timerStart : boolean = false;
  public timer : any;
  public graphData : any = {};
  public rangeDataUi : any = {};
  public finalValue : any = {};
  public selectedDrop;msaMin;msaMax;msaValue;headerYear;msaValueComma;
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
              public loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              private numberPipe: DecimalPipe,
              public myApp : MyApp,
              public modalCtrl: ModalController) {
             this.paramsData = this.navParams.get('data');
             this.finalValue = this.paramsData.Table1[0];
             this.riskProfile = this.finalValue.RiskProfile;
            //  console.log(this.paramsData)
             this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.wedding;
            this.msaMin = parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.min);
            this.msaMax = this.finalValue.CurrentCostOfWedding;
            this.msaValue  = parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default);
            
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
          //   //    $('.fixed-content').css('margin-top', hedaerheight);
          //     //  $('.scroll-content').css('margin-top', hedaerheight);
          //     }, 100);
          //   }
        
          // }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("25");
    this.utilitiesProvider.googleAnalyticsTrackView('Marriage Goal');

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

    this.msaValueComma = "₹" + (a ? this.numberPipe.transform(a.toString().replaceAll(",","")) : "");

    $('.resize ').css('width', per + '%');
    if(b == 'fromHtml'){
      this.CalculateWeddingGoal();
    }

  }
  menuToggle(){
    this.menuCtrl.open();
  }
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }
  riskProfileFun(){
    this.CalculateWeddingGoal();
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
        "title" :this.utilitiesProvider.langJsonData['marriageGoal']['rateOfInflation'],
        "type" : "perc",
        "info"  : this.utilitiesProvider.infoPopupText[0].desc
      }
    }
    if(type === 'IncrementalSavings'){
      this.utilitiesProvider.rangeData = this.finalValue.IncrementalSavings_perc_yearly;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.IncrementalSavings_perc_yearly,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.max),
        "title" :this.utilitiesProvider.langJsonData['marriageGoal']['increasingSavingsRate'],
        "type" : "",
        "info"  : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if(type === 'costOfWedding'){
      this.utilitiesProvider.rangeData = this.finalValue.CurrentCostOfWedding;
      this.rangeDataUi = {
        "steps" : 20000,
        "amount" :this.finalValue.CurrentCostOfWedding,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max),
        "title" :this.utilitiesProvider.langJsonData['marriageGoal']['currentCostOfWedding'],
        "type" : "r",
        "info"  : ""
      }
    }
    
    
    if(type === 'timeToWedding'){
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
    
   
    
 
}

 done(){
  let d = parseFloat(this.utilitiesProvider.rangeData);
  if(d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)){
    this.restapiProvider.presentToastTop("Please enter number between " + this.rangeDataUi.min + " to " + this.rangeDataUi.max)
  }
   else{
  if(this.selectedDrop == "inflation"){
    this.status = !this.status;
    this.finalValue.RateOfInflation = this.utilitiesProvider.rangeData;
     this.CalculateWeddingGoal();
  }
  if(this.selectedDrop == "IncrementalSavings"){
    this.status = !this.status;
    this.finalValue.IncrementalSavings_perc_yearly = this.utilitiesProvider.rangeData;
     this.CalculateWeddingGoal();
  }
  if(this.selectedDrop == "costOfWedding"){
    this.status = !this.status;
    this.finalValue.CurrentCostOfWedding = this.utilitiesProvider.rangeData;
     this.CalculateWeddingGoal();
  }
  if(this.selectedDrop == "timeToWedding"){
    this.status = !this.status;
    this.finalValue.TimeForGoal = parseInt(this.utilitiesProvider.rangeData);
     this.CalculateWeddingGoal();
  }
   }
 }

CalculateWeddingGoal() {
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
    "CurrentAmount": this.finalValue.CurrentCostOfWedding,
    "Period": this.finalValue.TimeForGoal,
    "LumpsumAvailable": this.finalValue.LumpSumAvailable,
    "Inflation": this.finalValue.RateOfInflation,
    "IncrementalSavings": this.finalValue.IncrementalSavings_perc_yearly,
    "LumpsumCompound":this.finalValue.LumpsumCompound_perc ?  this.finalValue.LumpsumCompound_perc : 0,
    "RiskProfile": this.finalValue.RiskProfile_categoryID,
  }
  return this.restapiProvider.sendRestApiRequest(request, 'CalculateWeddingGoal').subscribe((response) => {
    this.pageLoader = false;  
     if (response.IsSuccess == true) {
        this.finalValue = response.Data.Table1[0];
        this.msaMax = this.finalValue.CurrentCostOfWedding;
        this.paramsData =  response.Data;
        this.yearCal();
        let pvOfLum = this.paramsData.Table[0].PVOFLumpsum;
        let a  = parseFloat(this.finalValue.LumpSumAvailable) +  parseFloat(pvOfLum);
        this.doSomething(a, 'fromJs');
        // console.log(response.Data)
        // console.log(this.utilitiesProvider.defaultGoalData)
      }
    },
    (error) => {
      this.pageLoader = false;
    })
  },500)
}

replan(){

  this.setUpshotEvent('Replan');

  this.navCtrl.setRoot('MarriagePage', { pageFrom: this.drivenFrom})
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
    "fromPage" : "MarriageFinalPage",
    "headerTitle" : this.utilitiesProvider.langJsonData['marriageGoal']['marriageGoal'],
    "assetsPage" : "MarriageAssetAllocationPage",
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
  this.navCtrl.push('MarriageAssetAllocationPage', {data : this.paramsData, from: type=='compare'?'Compare Now':'Get My Recommendations'})
}
    
      takeScreenshot(){
        // this.utilitiesProvider.screenShotURI();
        this.content.scrollToTop();
        this.pageLoader = true;
        setTimeout(() => {
          this.utilitiesProvider.htmlToCanvas("capture-marriagegoal").then(result => {
            setTimeout(() => {
              this.pageLoader = false;
            }, 1500);
          })
        }, 1000);

        this.utilitiesProvider.setUpshotShareEvent('Goal', 'Marriage Goal');
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
          goNotificationList(){
            this.navCtrl.push('NotificationPage');
          }

  setUpshotEvent(action) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.drivenFrom,
      "InTheYear": (new Date()).getFullYear() + Number(this.finalValue.TimeForGoal),
      "Duration": this.finalValue.TimeForGoal,
      "WeddingCost": this.finalValue.CurrentCostOfWedding,
      "CostRequired": this.finalValue.RequiredForWedding,
      "FutureValue": this.finalValue.FVWedding,
      "SuggestedSaving": this.finalValue.MonthlySavingRequired,
      "Risk": this.riskData.filter(el=>el.ProfileID == this.finalValue.RiskProfile_categoryID)[0]["Profiler_Name"],
      "InflationRate": this.finalValue.RateOfInflation,
      "IncreasingSavingRate": this.finalValue.IncrementalSavings_perc_yearly,
      "Action": action
    }
    // console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('MarriageGoal', payload, false);
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

