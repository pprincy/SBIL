import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../providers/utilities/utilities';

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {

  @ViewChild(Content) content: Content;
  public steps = 100;
  public amount;
  public minValue;
  public maxValue;
  minCarCost; maxCarCost;carCost;
  minTimeToBuyCar; maxTimeToBuyCar;
  minDownPayPer; maxDownPayPer; downPaymentPer; downPayment; minDownPayment;maxDownPayment;
  timeToBuyCarRange :  any = [];
  public isBtnActive:boolean = false;
  public status:boolean = false;
  postJson : any = {};
  backBtnhide : boolean = true;
  carList : any = [];
  @ViewChild(Slides) slides: Slides;
  loading :any;scrollHeight;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
    private loadingCtrl: LoadingController) {
  }
  ionViewDidEnter(){
   
   
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
    //$('.scroll_div .scroll-content').attr('style',this.scrollHeight);
   // $('.scroll_div .fixed-content').attr('style',this.scrollHeight);

   this.utilitiesProvider.upshotScreenView('ContactUs');
  }
  ionViewDidLoad() {
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.car;
    this.minCarCost = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min);
    this.maxCarCost = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max);
    this.carCost = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min);
    this.minTimeToBuyCar =parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.min);
    this.maxTimeToBuyCar =parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.max);
    this.minDownPayPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.min);
    this.maxDownPayPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.max);
    this.downPaymentPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.default);
    this.downPayment = this.minCarCost;
    this.minDownPayment =  this.minCarCost;
    this.maxDownPayment = this.minCarCost;
    // console.log(this.utilitiesProvider.defaultGoalData);  
      for(let i = this.minTimeToBuyCar;i <= this.maxTimeToBuyCar; i++){
        this.timeToBuyCarRange.push(i);
      }
    this.startLoad();
  }
 startLoad(){
  
  setTimeout(()=>{
    this.carList = this.utilitiesProvider.defaultGoalData.data.cost.default.type;
    $('.tell_us_slider').not('.slick-initialized').slick({
      focusOnSelect: true,dots: false,infinite: true,
      speed: 300,cssEase: 'linear',slidesToShow: 7,slidesToScroll: 5,
     centerMode: true,variableWidth: true, arrows: false
    }); 
  $('.tell_us_slider .slick-current').trigger('click');
  $('.tell_us_slider').css('opacity',1);
  },500);

  setTimeout(()=>{ 
  $('.car_goal_slider').slick({
    focusOnSelect: true, dots: false,infinite: true,
    speed: 300,cssEase: 'linear', slidesToShow: 3,
    slidesToScroll: 1,centerMode: true,swipe:true,arrows: false
}); 
$('.car_goal_slider_wrap').css('opacity',1);
},500);
  setTimeout(function(){
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);
  $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
    let retirementCorpusDateVar = new Date();
    let d = retirementCorpusDateVar.getFullYear();
    let selectedYearHome = parseInt($(".tell_us_slider .slick-current .tell_us_slider_age").text());
      $('.diffYear').html(d + selectedYearHome);
    });
 }

 changeCar(){
  let selectedCarCost = parseInt($(".car_goal_slider .slick-current .car_goal_slider_item_inner p").text());
  this.carCost = selectedCarCost;
 }
  doSomething(e){
    if(this.carCost >= (this.maxCarCost / 3) && this.carCost <= (this.maxCarCost / 2)){
      this.steps = 1000;
    }
    else if(this.carCost >= (this.maxCarCost / 2) ){
    this.steps = 2000;
    }      
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

      let currentIndex = this.slides.getActiveIndex();
      if(currentIndex == 0){
        this.maxDownPayment = this.carCost;
        this.downPayment = (this.maxDownPayment * this.downPaymentPer) / 100;
      }
       if(currentIndex == 2){
        let minDown  = (this.maxDownPayment * this.minDownPayPer) / 100;
        if(this.downPayment  <  minDown ||   this.downPayment > this.maxDownPayment){
          this.restapiProvider.presentToastTop("Please enter down payment between " +  this.minDownPayment + " to " + this.maxDownPayment)
        }
        else{
        this.CalculateCarGoal();
        }
      }
      else{
          this.slides.slideTo(currentIndex + 1, 500);
          this.activateBar();
         
      }
    }
    back(){
       
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
      this.maxDownPayment = this.carCost;
      if(type == "range"){
        this.downPayment = (this.maxDownPayment * this.downPaymentPer) / 100;
      }
      if(type == "input"){
          let per  =  (this.downPayment * 100) / this.maxDownPayment;
           this.downPaymentPer = per.toLocaleString('en-IN', {minimumFractionDigits: 2});  
      }
    }
  
    CalculateCarGoal() {
      this.loaderShow();
      let request = {
        "CustID": this.restapiProvider.userData['CustomerID'],
        'TokenId': this.restapiProvider.userData['tokenId'],
        "CurrentAmount": this.carCost,
        "Period": $(".tell_us_slider .slick-current .tell_us_slider_age").text(), 
        "LumpsumAvailable":parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default),
        "Inflation":parseInt(this.utilitiesProvider.defaultGoalData.data.inflation_rate.default), 
        "IncrementalSavings":parseInt(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default),
        "LumpsumCompound":parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_compound.default),
        "RiskProfile":"", 
        "DownPaymentPerc": this.downPaymentPer,
        "EMIInterest":parseInt(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.min), 
        "LoanAmount": "",
        "LoanDuration": parseInt(this.utilitiesProvider.defaultGoalData.data.loan_duration_yr.min)
        }
        // console.log(request)
      return this.restapiProvider.sendRestApiRequest(request, 'CalculateCarGoal').subscribe((response) => {
          if (response.IsSuccess == true) {
            this.loading.dismiss();
            this.navCtrl.push('UserEditPage', {data : response.Data});
          }
          else {
            this.loading.dismiss();
            // console.log(response);
          }
        },
        (error) => {
          this.loading.dismiss();
        })
    }
  
  loaderShow(){
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange: true
      });
    this.loading.present();
  }
}

