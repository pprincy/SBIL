import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, MenuController } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import {MyApp} from '../../../app/app.component';
import { materialize } from 'rxjs/operator/materialize';



@IonicPage()
@Component({
  selector: 'page-quit-smoking',
  templateUrl: 'eating-out.html',
})
export class EatingOutPage {
  @ViewChild(Content) content: Content;
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


  //public expected_rate_of_return;
  public cost_per_ciggarette;
  public years_ive_been_smoking;
  public no_of_ciggarettes_per_day; no_of_ciggarettes_per_dayMin; no_of_ciggarettes_per_dayMax;
  public tarInTheYear;
  public  saving;
  public lifeReduce;

  public outings_per_month;
  public outings_per_month_min;
  public outings_per_month_max;

  public avg_cost_per_outings;
  public avg_cost_per_outings_min;
  public avg_cost_per_outings_max;

  public expected_rate_of_return;
  public expected_rate_of_return_max;
  public expected_rate_of_return_min;

public reduction_in_outing;
public reduction_in_outing_min;
public reduction_in_outing_max;

public amt_saved_per_month;
public amt_saved;
public image;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public myApp : MyApp) {
    this.paramsData = this.navParams.get('data');
    this.myApp.updatePageUseCount("56");
    this.utilitiesProvider.googleAnalyticsTrackView('Eating Out');
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
    // console.log("Data:", this.utilitiesProvider.defaultData)
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators.eatingout;
    // this.expected_rate_of_return =parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.default)
    // this.cost_per_ciggarette = parseInt(this.utilitiesProvider.defaultCalData.cost_per_ciggarette.deafult);
    // this.years_ive_been_smoking = parseInt(this.utilitiesProvider.defaultCalData.years_ive_been_smoking.default);
    // this.no_of_ciggarettes_per_day = parseInt(this.utilitiesProvider.defaultCalData.no_of_ciggarettes_per_day.default)
    // this.no_of_ciggarettes_per_dayMin = parseInt(this.utilitiesProvider.defaultCalData.no_of_ciggarettes_per_day.min)
    // this.no_of_ciggarettes_per_dayMax = parseInt(this.utilitiesProvider.defaultCalData.no_of_ciggarettes_per_day.max)
    
    this.outings_per_month=parseInt(this.utilitiesProvider.defaultCalData.outings_per_month.default);
    this.outings_per_month_min=parseInt(this.utilitiesProvider.defaultCalData.outings_per_month.min);
    this.outings_per_month_max=parseInt(this.utilitiesProvider.defaultCalData.outings_per_month.max);

    this.avg_cost_per_outings=parseInt(this.utilitiesProvider.defaultCalData.avg_cost_per_outings.default);
    this.avg_cost_per_outings_min=parseInt(this.utilitiesProvider.defaultCalData.avg_cost_per_outings.min);
    this.avg_cost_per_outings_max=parseInt(this.utilitiesProvider.defaultCalData.avg_cost_per_outings.max);

    this.expected_rate_of_return=parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.default);
    this.expected_rate_of_return_min=parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.min);
    this.expected_rate_of_return_max=parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.max);

    this.reduction_in_outing_min=parseInt(this.utilitiesProvider.defaultCalData.reduction_in_outing.min);
  this.reduction_in_outing_max=parseInt(this.utilitiesProvider.defaultCalData.outings_per_month.default);

  this.reduction_in_outing=Math.round(this.reduction_in_outing_max*55/100);
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

 this.utilitiesProvider.upshotScreenView('EatingOut');
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
    if(type === 'outings_per_month'){
      this.utilitiesProvider.rangeData = this.outings_per_month;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.outings_per_month,
        "min" :  parseInt(this.utilitiesProvider.defaultCalData.outings_per_month.min),
        "max" :  parseInt(this.utilitiesProvider.defaultCalData.outings_per_month.max),
        "title" :this.utilitiesProvider.langJsonData['eatingOutCalculator']['outingsPerMonth'],
        "type" : "",
        "info"  : ""
      }
    }
    if(type === 'expected_rate_of_return'){
      this.utilitiesProvider.rangeData = this.expected_rate_of_return;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.expected_rate_of_return,
        "min" :  parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.min),
        "max" :  parseInt(this.utilitiesProvider.defaultCalData.expected_rate_of_return.max),
        "title" :this.utilitiesProvider.langJsonData['eatingOutCalculator']['annualSavingGrowthRate'],
        "type" : "",
        "info"  : ""
      }
    }
      if(type === 'avg_cost_per_outings'){
        this.utilitiesProvider.rangeData = this.avg_cost_per_outings;
        this.rangeDataUi = {
          "steps" : 1,
          "amount" :this.avg_cost_per_outings,
          "min" :  parseInt(this.utilitiesProvider.defaultCalData.avg_cost_per_outings.min),
          "max" :  parseInt(this.utilitiesProvider.defaultCalData.avg_cost_per_outings.max),
          "title" :this.utilitiesProvider.langJsonData['eatingOutCalculator']['averageCostPerOuting'],
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
          if(this.selectedDrop == "outings_per_month"){
             this.outings_per_month = this.utilitiesProvider.rangeData;
             this.reduction_in_outing_max = this.outings_per_month;
             if(this.reduction_in_outing>this.reduction_in_outing_max)
             {
               this.reduction_in_outing=this.reduction_in_outing_max;
             }
             this.reduction_in_outing=Math.round(this.reduction_in_outing_max*55/100);
          }
          if(this.selectedDrop == "expected_rate_of_return"){
            this.expected_rate_of_return = this.utilitiesProvider.rangeData;
          }
          if(this.selectedDrop === 'avg_cost_per_outings'){
           this.avg_cost_per_outings = this.utilitiesProvider.rangeData;
          }
     this.calResult();
    }
         
      }
   

      goBack() {
        this.setUpshotEvent('Back');
    this.navCtrl.pop();
  }

  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'Eating Out Caculator');
  }

  

 goToGoalsListing() {
  this.setUpshotEvent('Read Articles');
  this.navCtrl.setRoot('ArticlesPage', { source: 'Trends', header: this.utilitiesProvider.langJsonData['collections']['collections'], categoryID: '' });
  }
  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }

  reduction_in_outing_function(event){
    let per = 100 - event.value;
    $('.ba-slider .after').css('height', per + '%');
    this.calResult();

}


calResult(){
let duration = parseInt(this.utilitiesProvider.defaultCalData.duration.default);
let  total_amt_saved_per_month=this.reduction_in_outing*this.avg_cost_per_outings;
let tenure=duration*12;
let monthly_Ror=Math.pow(1+this.expected_rate_of_return/100,1/12)-1;
let inflation =  5;
let monthlyIncrementRate = Math.pow(1+ inflation/100,1/12)-1;

let partFormula1 = (1 + monthly_Ror) * Math.pow(1+monthlyIncrementRate,tenure - 1);
let partFormula2 =  Math.pow((1 + monthly_Ror)/(1 + monthlyIncrementRate) , tenure) - 1;
let partFormula3 = ((1+monthly_Ror)/(1+monthlyIncrementRate))-1;

let finalFormula = total_amt_saved_per_month * partFormula1 * (partFormula2 / partFormula3);
//this.amt_saved=total_amt_saved_per_month*(1+monthly_Ror)*(Math.pow(1+monthly_Ror,tenure)-1)/monthly_Ror;
this.amt_saved = finalFormula;
this.amt_saved_per_month=total_amt_saved_per_month;
this.changeImg();
}
  
convertInt(n){
  return Math.round(n);
}

changeImg()
  {
    let percent=(this.reduction_in_outing/this.reduction_in_outing_max)*100;
    if(percent>=66)
    {
      this.image = "assets/imgs/eating_out1.png";
    }
    if(percent<66 && percent>33)
    {
      this.image = "assets/imgs/eating_out2.png";
    }
    if(percent<=33)
    {
      this.image = "assets/imgs/eating_out3.png";
    }
  }

  setUpshotEvent(action) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.navParams.get('pageFrom') || '',
      "AmountSaved": this.amt_saved_per_month,
      "AmtSavedin5years": Number(this.amt_saved) > 0 ? Number(this.amt_saved) : 0,
      "ReductionOuting": this.reduction_in_outing_min,
      "OutingsperMonth": this.outings_per_month,
      "AvgCostperOuting": this.avg_cost_per_outings,
      "Action": action
    }
    // console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('EatingOut', payload, false);
  }
}



