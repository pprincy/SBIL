import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import { DecimalPipe } from '@angular/common';
@IonicPage()
@Component({
  selector: 'page-home-goal',
  templateUrl: 'home-goal.html',
})
export class HomeGoalPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public selectHomeBar : any = [];
  public steps = 200000;
  public amount;
  public minCostHome;
  public maxCostHome;
  public minDownPayPer;
  public maxDownPayPer; downPaymentPer; downPayment; minDownPayment; downPaymentComma;
  public status:boolean = false;
  public costOfHome; daughterTwoInvest;costOfHomeComma;
  public loading :any;
  public keyboardShow : boolean = false;
  public currentYear; yearDiff; maxDownPayment;
  public backBtnhide : boolean = true;
  public scrollHeight
  public pageLoader : boolean = false;
  public timeToGoalTemp;
  public pageFrom;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private restapiProvider: RestapiProvider,
              public utilitiesProvider : UtilitiesProvider,
              private loadingCtrl: LoadingController,
              private numberPipe: DecimalPipe,
              private keyboard: Keyboard) {
              this.keyboard.onKeyboardShow().subscribe(data => {
                this.keyboardShow = true;
              });
              this.keyboard.onKeyboardHide().subscribe(data => {
                this.keyboardShow = false;
              });

              this.pageFrom = this.navParams.get('pageFrom');
      }
  ionViewDidEnter(){
    
   if(this.navParams.get("data")){
    this.timeToGoalTemp = parseInt(this.navParams.get("data"))
   }
   else{
     this.timeToGoalTemp =  0;
   }
    this.slides.lockSwipes(true);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }

   this.utilitiesProvider.upshotScreenView('HomeGoal');
  }

  ionViewDidLoad() {
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.home;
    // console.log(this.utilitiesProvider.defaultGoalData) 
    this.minCostHome = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min);
    this.maxCostHome = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max);
    this.costOfHome = this.minCostHome;
    
    let amount : number = 0;
    let amountStr : String = "";
    if(this.costOfHome) {
      amount = Number(this.costOfHome.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.costOfHomeComma = "₹" + amountStr;
    this.minDownPayPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.min);
    this.maxDownPayPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.max);
    this.downPaymentPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.default);
    this.downPayment = this.minCostHome;

    let amount2 : number = 0;
    let amountStr2 : String = "0";
    if(this.downPayment) {
      amount2 = Number(this.downPayment.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr2 = amount.toLocaleString('en-IN');
    }
    this.downPaymentComma = "₹" + amountStr2;

    this.minDownPayment =  this.minCostHome;
    this.maxDownPayment = this.minCostHome;
    let minYear = parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.min) ;
    let maxYear = parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.max) ;
      for(let i = minYear;i <= maxYear; i++){
        this.selectHomeBar.push(i);
      }
      this.startLoad();
  }
 startLoad(){
 this.slides.lockSwipes(false);   
  setTimeout(()=>{ 
    $('.tell_us_slider').not('.slick-initialized').slick({
      focusOnSelect: true,
      dots: false,
      infinite: true,
      speed: 300,
      cssEase: 'linear',
      slidesToShow: 7,
      slidesToScroll: 5,
     centerMode: true,
      variableWidth: true,
      arrows: false
  }); 
  $('.tell_us_slider .slick-current').trigger('click');
  $('.tell_us_slider').css('opacity',1);
  this.slides.lockSwipes(true);
  },500);

  $('.tell_us_cont .ion-ios-add-circle-outline').click(function(e){
    e.stopPropagation();
    $(this).parents('.tell_us_cont').addClass('active');
    $('.tell_us_slider .slick-current').trigger('click');

  });

  $('.tell_us_cont .ion-md-create').click(function(e){
    e.stopPropagation();
   
  $(this).toggle();
    $(this).siblings('.icon').toggle();

  });
  setTimeout(()=>{
    let that = this;
    if(this.timeToGoalTemp > 0){
    $(".tell_us_slider.homeYear div").each(function(){
      var curAge = parseInt($(this).find('.tell_us_slider_age').html());
      if(curAge == that.timeToGoalTemp)
      {
          $(this).not('.slick-cloned').trigger('click');
      }
      })
    }
  },1500)
  setTimeout(function(){
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);

let that = this;
  $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
    let retirementCorpusDateVar = new Date();
    let d = retirementCorpusDateVar.getFullYear();
    let selectedYearHome = parseInt($(".homeYear.tell_us_slider .slick-current .tell_us_slider_age").text());
    that.yearDiff =  d + selectedYearHome;
      $('.diffYear').html((that.utilitiesProvider.langJsonData['homeGoal']['inTheYear']).replace('$year$', that.yearDiff))
    });
 }

  doSomething(e){
    if(this.costOfHome >= (this.maxCostHome / 3) && this.costOfHome <= (this.maxCostHome / 2)){
      this.steps = 750000;
    }
    else if(this.costOfHome >= (this.maxCostHome / 2)){
    this.steps = 1000000;
    }
    this.costOfHomeComma = "₹" + (this.costOfHome ? this.numberPipe.transform(this.costOfHome.toString().replaceAll(",","")) : "");
    // console.log(this.costOfHome) 
    // console.log(this.steps) 
    }
  toggleClass(id){
    $('#' + id).toggleClass('active')
 }
  activateBar(){
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').nextAll().removeClass('active');
    this.slides.lockSwipes(true);   
  }
  onSliderChange() {
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first =  $('.nps_age_first').height();
    var actualheight= slide_heading + nps_first*1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
    }
 
  next(){
    this.backBtnhide = false;
    this.slides.lockSwipes(false);
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 1){
      this.maxDownPayment = this.costOfHome;
      this.downPayment = (this.maxDownPayment * this.downPaymentPer) / 100;
      this.downPaymentComma = "₹" + (this.downPayment ? this.numberPipe.transform(this.downPayment.toString().replaceAll(",","")) : "0");
    }
     if(currentIndex == 2){
       let minDown  = (this.maxDownPayment * this.minDownPayPer) / 100;
      if(this.downPayment  <  minDown ||   this.downPayment > this.maxDownPayment){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['PleaseEnterDownPaymentBetween'] + " " +  this.minDownPayment + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.maxDownPayment)
      }
      else{
      this.CalculateHomeGoal();
      }
    }
    else{
        this.slides.slideTo(currentIndex + 1, 500);
        this.activateBar();
        this.slides.lockSwipes(true);
    }
  }
  back(){
    this.slides.lockSwipes(false);   
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset,0)
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 1){
      this.backBtnhide = true;
    }
    this.slides.slideTo(currentIndex - 1, 500);
    this.activateBar();
  }
  changeDownPayment(type){
    this.maxDownPayment = this.costOfHome;
    if(type == "range"){
      this.downPayment = (this.maxDownPayment * this.downPaymentPer) / 100;

      let amountStr : String = "";
      if(this.downPayment) {
        amountStr = this.downPayment.toLocaleString('en-IN');
      }
      this.downPaymentComma = "₹" + amountStr;
    }
    if(type == "input"){
      let amount : number = 0;
      let amountStr : String = "";
      if(this.downPaymentComma) {
        amount = Number(this.downPaymentComma.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }

      this.downPaymentComma = "₹" + amountStr;
      this.downPayment = amount;
      let per  =  (this.downPayment * 100) / this.maxDownPayment;
      this.downPaymentPer = per.toLocaleString('en-IN', {minimumFractionDigits: 2});  
    }
  }

  CalculateHomeGoal() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "CurrentAmount":this.costOfHome,
      "Period": $(".homeYear.tell_us_slider .slick-current .tell_us_slider_age").text(), 
      "DownPaymentPerc": this.downPaymentPer, 
      "LumpsumAvailable":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default),
      "Inflation":parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.default), 
      "IncrementalSavings":parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default),
      "LumpsumCompound":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_compound.default),
      "RiskProfile":"", 
      "EMIInterest":parseFloat(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.min), 
      "LoanAmount": "",
      "LoanDuration": 20
      }
    
      // console.log(request)
    return this.restapiProvider.sendRestApiRequest(request, 'CalculateHomeGoal').subscribe((response) => {
      this.pageLoader = false;  
        if (response.IsSuccess == true) {
          this.navCtrl.push('HomeGoalFinalPage', {data : response.Data, drivenFrom: this.pageFrom});
        }
      },
      (error) => {
        this.pageLoader = false;
      })
  }

  formatAmount(val) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.costOfHomeComma = "₹" + amountStr;
    this.costOfHome = amount;
  }
}
