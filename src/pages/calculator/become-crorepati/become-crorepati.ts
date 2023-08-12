import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, MenuController, Slides  } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import {MyApp} from '../../../app/app.component';
import { DecimalPipe } from '@angular/common';
@IonicPage()
@Component({
  selector: 'page-become-crorepati',
  templateUrl: 'become-crorepati.html',
})
export class BecomeCrorepatiPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  public steps = 100;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader : boolean = false;
  public disclaimer : any = false;
  paramsData: any;
  loading: any;
  timerStart: boolean = false;
  timer: any;
  graphData: any = {};
  pagerHide: boolean = false;
  selectedDrop; public rangeDataUi: any = {};
  public headerYear;

  public expected_rate_of_return;
  public increasing_savings_rate; 
  public i_want_be_a_crorepati_in;
  public amount; minAmount = 0; maxAmount;amountComma;
  public suggestedSaving;
  public amountToSave;
  public youNeedAmount;
  public suggestedSavingPM;
  public amountForCr = 10000000;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    private numberPipe: DecimalPipe,
    public myApp : MyApp) {
    this.paramsData = this.navParams.get('data');
   
    this.myApp.updatePageUseCount("55");
    this.utilitiesProvider.googleAnalyticsTrackView('BecomeCrorepati');
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

  ionViewDidLeave(){
    localStorage.removeItem("temp")
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);   
    // console.log("Data:", this.utilitiesProvider.defaultData)
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators.crorepati.data;
    this.expected_rate_of_return =parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.default)
    this.increasing_savings_rate =parseInt(this.utilitiesProvider.defaultCalData.increasing_savings_rate.default)
    this.i_want_be_a_crorepati_in = parseInt(this.utilitiesProvider.defaultCalData.i_want_be_a_crorepati_in.deafult)
    this.amount = parseInt(this.utilitiesProvider.defaultCalData.amount.default);
    this.amountComma = "₹" + (this.amount ? this.numberPipe.transform(this.amount.toString().replaceAll(",","")) : "0");

    // this.amount = 0;

    // let growth_rate_of_lumpsum = parseInt(this.utilitiesProvider.defaultCalData.growth_rate_of_lumpsum.default)/100;
    // let tenureOfMonth = this.i_want_be_a_crorepati_in * 12;
    
    this.calResult();

    // this.scrollToTop();
    // // this.yearCal();
    // this.content.ionScroll.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
  
    // });

    // this.content.ionScrollStart.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });

 $('.swiper-pagination-bullet').hide();
 setTimeout(() => {
  this.amountChange();  
 }, 200);

 this.utilitiesProvider.upshotScreenView('BecomeACrorepati');
  }

  amountChange(){
    this.amountComma = "₹" + (this.amount ? this.numberPipe.transform(this.amount.toString().replaceAll(",","")) : "0");
   if(this.amount > (this.maxAmount / 2)){
    //this.steps = 10000;
    if((this.maxAmount - this.amount) < 10000){
      this.steps = 1;
    }
    else{
     this.steps = 1000;
    }
     if(this.amount  == this.maxAmount){
      $('.crorepati_content_td_rupee_with_man').addClass('step3').removeClass('step2 step1');
        $('.crorepati_content_td_rupee').addClass('step3').removeClass('step2 step1');
      }
    }
    else if((this.amount > (this.maxAmount / 3)) && (this.amount < (this.maxAmount / 2))){
      $('.crorepati_content_td_rupee_with_man').addClass('step2').removeClass('step1 step3');
       $('.crorepati_content_td_rupee').addClass('step2').removeClass('step1 step3');
       this.steps = 1500;
     }
     else if((this.amount == 0) && (this.amount < (this.maxAmount / 3))){
      $('.crorepati_content_td_rupee_with_man').addClass('step1').removeClass('step2 step3');
       $('.crorepati_content_td_rupee').addClass('step1').removeClass('step2 step3');
       this.steps = 2000;
     }
  //  else if(){

  //  }
      // if(this.amount >= 100000 && this.amount < 2000000)
      // {
      //   $('.crorepati_content_td_rupee_with_man').addClass('step1').removeClass('step2 step3');
      //   $('.crorepati_content_td_rupee').addClass('step1').removeClass('step2 step3');
      // }
      // else if(this.amount >= 2000000 && this.amount < 3500000){
      // $('.crorepati_content_td_rupee_with_man').addClass('step2').removeClass('step3 step1');
      //   $('.crorepati_content_td_rupee').addClass('step2').removeClass('step3 step1');
       
      // }
      // else if(this.amount == this.maxAmount){
      //   $('.crorepati_content_td_rupee_with_man').addClass('step3').removeClass('step2 step1');
      //   $('.crorepati_content_td_rupee').addClass('step3').removeClass('step2 step1');
      // }
      this.calResult();
  //}
}
  menuToggle() {
    this.menuCtrl.open();
  }
  

  

  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }

  showOverlay(type) {
    this.selectedDrop = type;
    this.status = !this.status;
    $('.header').addClass('headerOverlay');
    $('.scroll-content').addClass('scrollOverlay');
    if(type === 'IncrementalSavings'){
      this.utilitiesProvider.rangeData = this.increasing_savings_rate;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.increasing_savings_rate,
        "min" :  parseInt(this.utilitiesProvider.defaultCalData.increasing_savings_rate.min),
        "max" :  parseInt(this.utilitiesProvider.defaultCalData.increasing_savings_rate.max),
        "title" : this.utilitiesProvider.langJsonData['becomeACrorepati']['increasingSavingsRate'],
        "type" : "",
        "info"  : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if(type === 'rateOfInterest'){
      this.utilitiesProvider.rangeData = this.expected_rate_of_return;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.expected_rate_of_return,
        "min" :  parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.min),
        "max" :  parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.max),
        "title" :this.utilitiesProvider.langJsonData['becomeACrorepati']['rateOfInterest'],
        "type" : "",
        "info"  : ""
      }
    }
    if(type === 'i_want_be_a_crorepati_in'){
      this.utilitiesProvider.rangeData = this.i_want_be_a_crorepati_in;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.i_want_be_a_crorepati_in,
        "min" :  parseInt(this.utilitiesProvider.defaultCalData.i_want_be_a_crorepati_in.min),
        "max" :  parseInt(this.utilitiesProvider.defaultCalData.i_want_be_a_crorepati_in.max),
        "title" :this.utilitiesProvider.langJsonData['becomeACrorepati']['iWantToBeACrorepatiIn'],
        "type" : "",
        "info"  : ""
      }
    }
  }


  done() {
    let d = parseFloat(this.utilitiesProvider.rangeData);
    if(d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)){
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
    }
    else{
          this.status = !this.status;
          $('.header').removeClass('headerOverlay');
          $('.scroll-content').removeClass('scrollOverlay');
          if(this.selectedDrop == "IncrementalSavings"){
            this.increasing_savings_rate = this.utilitiesProvider.rangeData;
          }
          if(this.selectedDrop == "rateOfInterest"){
            this.expected_rate_of_return = this.utilitiesProvider.rangeData;
          }
          if(this.selectedDrop === 'i_want_be_a_crorepati_in'){
            this.i_want_be_a_crorepati_in = this.utilitiesProvider.rangeData;
          }
          this.calResult();
    }

      }
   

  recalculate() {
    this.setUpshotEvent('Back');
  this.navCtrl.pop();
  }

  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'Become Crorepati Caculator');
  }
  
  convertInt(n){
    return Math.round(n);
    }

 goToGoalsListing() {
  this.setUpshotEvent('Read Articles');
  this.navCtrl.setRoot('ArticlesPage', { source: 'Trends', header: this.utilitiesProvider.langJsonData['collections']['collections'], categoryID: '' });
  }
  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }

  calResult(){
    let calAmount   = 10000000;
    let growth_rate_of_lumpsum = parseInt(this.utilitiesProvider.defaultCalData.growth_rate_of_lumpsum.default)/100;
     let FVofSaving = this.amount * Math.pow((1+growth_rate_of_lumpsum), this.i_want_be_a_crorepati_in);
     let gap = calAmount - FVofSaving;
    let tenureOfMonth = this.i_want_be_a_crorepati_in * 12;
    let monthlyROR =  Math.pow((1 + this.expected_rate_of_return/100) , 1/12) - 1;


    let maxAmt : any;
     maxAmt = 10000000/(Math.pow((1 + growth_rate_of_lumpsum) , this.i_want_be_a_crorepati_in));
    this.maxAmount = Math.round(maxAmt);
    if(this.amount > this.maxAmount){
      this.amount = this.maxAmount;
      this.amountComma = "₹" + (this.amount ? this.numberPipe.transform(this.amount.toString().replaceAll(",","")) : "0");
    }

    let rateOfInterest = this.increasing_savings_rate / 100;
    let monthlyIncrementRate  : any;  
        monthlyIncrementRate = (Math.pow((1 + rateOfInterest) , 1/12) - 1);
        monthlyIncrementRate = parseFloat(monthlyIncrementRate.toFixed(4));
    let partOfFormulaOne = ((1 + monthlyROR)) * (Math.pow((1 + monthlyIncrementRate), (tenureOfMonth - 1)))
    let partOfFormulaTwo = Math.pow((1 + monthlyROR) / (1 + monthlyIncrementRate), tenureOfMonth ) -1;
    let partOfFormulaThree = (1 + monthlyROR) /  (1 + monthlyIncrementRate)  - 1;
    this.suggestedSavingPM = gap * partOfFormulaThree /(partOfFormulaTwo*partOfFormulaOne);
    this.amountToSave = gap;
    }

    setUpshotEvent(action) {
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "DrivenFrom": this.navParams.get('pageFrom') || '',
        "NeedtoSaveAmt": Number(this.suggestedSavingPM) > 0 ?  Number(this.suggestedSavingPM): 0,
        "TargetAmount": Number(this.amountForCr) > 0 ?  Number(this.amountForCr): 0,
        "AmountAlreadySaved": Number(this.amountForCr) > 0 ?  Number(this.amountForCr): 0,
        "AmounttoSaveperyear": Number(this.amount) > 0 ?  Number(this.amount): 0,
        "ROR": this.expected_rate_of_return,
        "ISR": this.increasing_savings_rate,
        "Duration": this.i_want_be_a_crorepati_in,
        "Action": action
      }
      // console.log(payload)
      this.utilitiesProvider.upshotCustomEvent('BecomeACrorepati', payload, false);
    }

    formatAmount(val) {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      
      this.amountComma = "₹" + amountStr;
      this.amount = amount;
    }
}

