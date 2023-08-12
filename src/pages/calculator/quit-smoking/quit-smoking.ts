import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, MenuController , Slides} from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import {MyApp} from '../../../app/app.component';
import { materialize } from 'rxjs/operator/materialize';
@IonicPage()
@Component({
  selector: 'page-quit-smoking',
  templateUrl: 'quit-smoking.html',
})
export class QuitSmokingPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  public steps = 15;
  public amountD1;
  public amountD2;
  public minValue;
  public maxValue;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader : boolean = false;
  public Daughter1: any = {};
  public Daughter2: any = {};
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
  public cost_per_ciggarette;
  public years_ive_been_smoking;
  public no_of_ciggarettes_per_day; no_of_ciggarettes_per_dayMin; no_of_ciggarettes_per_dayMax;
  public tarInTheYear;
  public  saving;
  public lifeReduce;
  public info : boolean = false;
  public infoText = "";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public myApp : MyApp) {
    this.paramsData = this.navParams.get('data');
    this.myApp.updatePageUseCount("54");
    this.utilitiesProvider.googleAnalyticsTrackView('QuitSmoking');
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
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators.smokingless.data;
    this.expected_rate_of_return =parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.default)
    this.cost_per_ciggarette = parseInt(this.utilitiesProvider.defaultCalData.cost_per_ciggarette.deafult);
    this.years_ive_been_smoking = parseInt(this.utilitiesProvider.defaultCalData.years_ive_been_smoking.default);
    this.no_of_ciggarettes_per_day = parseInt(this.utilitiesProvider.defaultCalData.no_of_ciggarettes_per_day.default)
    this.no_of_ciggarettes_per_dayMin = parseInt(this.utilitiesProvider.defaultCalData.no_of_ciggarettes_per_day.min)
    this.no_of_ciggarettes_per_dayMax = parseInt(this.utilitiesProvider.defaultCalData.no_of_ciggarettes_per_day.max)
     this.calResult();
    this.minValue = 1;
    this.maxValue = 15;
    this.amountD1 = 1;
    // this.scrollToTop();
    // this.yearCal();
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

 this.utilitiesProvider.upshotScreenView('QuitSmoking');
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
    if(type === 'rateOfInterest'){
      this.utilitiesProvider.rangeData = this.expected_rate_of_return;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.expected_rate_of_return,
        "min" :  parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.min),
        "max" :  parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.max),
        "title" :this.utilitiesProvider.langJsonData['quitSmoking']['rateOfInterest'],
        "type" : "",
        "info"  : ""
      }
    }
    if(type === 'cost_per_ciggarette'){
      this.utilitiesProvider.rangeData = this.cost_per_ciggarette;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.cost_per_ciggarette,
        "min" :  parseInt(this.utilitiesProvider.defaultCalData.cost_per_ciggarette.min),
        "max" :  parseInt(this.utilitiesProvider.defaultCalData.cost_per_ciggarette.max),
        "title" :this.utilitiesProvider.langJsonData['quitSmoking']['costOfTheCigarette'],
        "type" : "r",
        "info"  : ""
      }
    }
      if(type === 'years_ive_been_smoking'){
        this.utilitiesProvider.rangeData = this.years_ive_been_smoking;
        this.rangeDataUi = {
          "steps" : 1,
          "amount" :this.years_ive_been_smoking,
          "min" :  parseInt(this.utilitiesProvider.defaultCalData.years_ive_been_smoking.min),
          "max" :  parseInt(this.utilitiesProvider.defaultCalData.years_ive_been_smoking.max),
          "title" :this.utilitiesProvider.langJsonData['quitSmoking']['yearsIveBeenSmokingFor'],
          "type" : "",
          "info"  : ""
        }
      }
    

    
  }


  done() {
    let d = parseFloat(this.utilitiesProvider.rangeData);
    if(d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)){
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to']  + this.rangeDataUi.max)
    }
    else{
          this.status = !this.status;
          $('.header').removeClass('headerOverlay');
          $('.scroll-content').removeClass('scrollOverlay');
          if(this.selectedDrop == "cost_per_ciggarette"){
             this.cost_per_ciggarette = this.utilitiesProvider.rangeData;
          }
          if(this.selectedDrop == "rateOfInterest"){
            this.expected_rate_of_return = this.utilitiesProvider.rangeData;
          }
          if(this.selectedDrop == 'years_ive_been_smoking'){
           this.years_ive_been_smoking = this.utilitiesProvider.rangeData;
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

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'Quit Smoking Caculator');
  }


 goToGoalsListing() {
  this.setUpshotEvent('Read Articles');

  this.navCtrl.setRoot('ArticlesPage', { source: 'Trends', header: this.utilitiesProvider.langJsonData['collections']['collections'], categoryID: '' });
  }
  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }

  no_of_ciggarettes_per_dayFun(event){
    //let per = 100 - event.value;
   // per = 0
   // $('.ba-slider .after').css('height', per + '%');
    this.calResult();

}


calResult(){
  let tarPerCig = 0.007;
  let savingPerMonth = this.cost_per_ciggarette * this.no_of_ciggarettes_per_day * 30;
  let tenure =  this.years_ive_been_smoking * 12;
  let savingGrowthRate = this.expected_rate_of_return;
  let monthlyROR = Math.pow((1 + savingGrowthRate/100), 1/12) - 1;
  this.saving = savingPerMonth * (1+ monthlyROR) * (Math.pow(( 1 + monthlyROR), tenure) -1)/ monthlyROR;
  this.tarInTheYear =tarPerCig *365 * this.no_of_ciggarettes_per_day * this.years_ive_been_smoking;
  this.lifeReduce  = (((this.no_of_ciggarettes_per_day*11*365)/60)/24)  * this.years_ive_been_smoking;
  // console.log(this.lifeReduce)
  let per = 100 - (((this.tarInTheYear / 4088) * 100));
  if(per  < 0){
    per = 100;
  }
  $('.ba-slider .after').css('height', per  + '%');


}
  
convertInt(n){
return Math.round(n);
}

convertNumToYear(n){
let a = Math.round(n);
if(a > 365){
  return (a / 365).toFixed(2)  + " " + this.utilitiesProvider.commonLangMsg['year'] + " " + this.utilitiesProvider.commonLangMsg['se'];
}
else
{
  return a  + " " + this.utilitiesProvider.langJsonData['quitSmoking']['days'] + " " + this.utilitiesProvider.commonLangMsg['se'];
}
}

infoFun(i){
  this.info = !this.info;
if(i == 1){
this.infoText = this.utilitiesProvider.langJsonData['quitSmoking']['popUpText1']
}
if(i == 2){
  this.infoText = this.utilitiesProvider.langJsonData['quitSmoking']['popUpText2']
  }
  
}
infoClose(){
  this.info = !this.info;
}

setUpshotEvent(action) {
  let payload = {
    "Appuid": this.utilitiesProvider.upshotUserData.appUId,
    "Language": this.utilitiesProvider.upshotUserData.lang,
    "City": this.utilitiesProvider.upshotUserData.city,
    "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
    "DrivenFrom": this.navParams.get('pageFrom') || '',
    "LifespanReduced": this.lifeReduce,
    "AmountSaved": Number(this.saving) > 0 ? Number(this.saving) : 0,
    "CigarettesCount": this.no_of_ciggarettes_per_day,
    "ROI": this.expected_rate_of_return,
    "CostofCigarette": this.cost_per_ciggarette,
    "Duration": this.years_ive_been_smoking,
    "Action": action
  }
  // console.log(payload)
  this.utilitiesProvider.upshotCustomEvent('QuitSmoking', payload, false);
}

}


